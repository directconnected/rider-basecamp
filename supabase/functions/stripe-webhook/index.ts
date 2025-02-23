
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret!
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return new Response(`Webhook signature verification failed`, { status: 400 });
    }

    console.log(`Processing event type ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.metadata.user_id;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Update profile with subscription details
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          return new Response('Error updating profile', { status: 400 });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get profile by customer ID
        const { data: profiles, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select()
          .eq('stripe_customer_id', customerId)
          .single();

        if (profileError || !profiles) {
          console.error('Error finding profile:', profileError);
          return new Response('Error finding profile', { status: 400 });
        }

        // Update subscription status
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', profiles.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return new Response('Error updating subscription', { status: 400 });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get profile by customer ID
        const { data: profiles, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select()
          .eq('stripe_customer_id', customerId)
          .single();

        if (profileError || !profiles) {
          console.error('Error finding profile:', profileError);
          return new Response('Error finding profile', { status: 400 });
        }

        // Update subscription status to cancelled
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            subscription_period_end: null,
          })
          .eq('id', profiles.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return new Response('Error updating subscription', { status: 400 });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
