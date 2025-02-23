
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const descriptions: Record<string, string> = {
  "Acadia All-American Road": "The 40-mile Acadia All-American Road is one of the most scenic routes in Maine, winding through Acadia National Park. It offers stunning views of the Atlantic coastline, granite cliffs, and pristine forests. The road includes the 27-mile Park Loop Road, offering access to the park's major attractions including Thunder Hole, Sand Beach, and Cadillac Mountain.",
  
  "Beartooth Highway": "The Beartooth Highway is a 68-mile stretch of US Highway 212 linking Red Lodge, Montana with Yellowstone National Park. Rising to an elevation of 10,947 feet, it's one of America's most scenic drives, offering spectacular views of the Absaroka and Beartooth Mountains, glacial lakes, and alpine plateaus.",
  
  "Blue Ridge Parkway": "Known as 'America's Favorite Drive,' the Blue Ridge Parkway stretches 469 miles through Virginia and North Carolina, connecting Shenandoah National Park with Great Smoky Mountains National Park. The route features stunning mountain and valley vistas, colorful wildflower displays, and diverse recreational opportunities.",
  
  "Cherohala Skyway": "The Cherohala Skyway is a 43-mile National Scenic Byway that connects Tellico Plains, Tennessee, to Robbinsville, North Carolina. Winding through the Cherokee and Nantahala National Forests, the skyway offers spectacular views of the southern Appalachian Mountains, particularly stunning during fall foliage season.",
  
  "Death Valley Scenic Byway": "This 81-mile scenic drive through Death Valley National Park takes visitors through one of the most extreme landscapes in North America. The route includes views of colorful rock formations, sand dunes, and vast desert vistas, while passing by notable sites like Zabriskie Point and Badwater Basin, the lowest point in North America.",
  
  "Dinosaur Diamond Prehistoric Highway": "This 512-mile scenic loop through Colorado and Utah showcases some of the world's most significant dinosaur fossil quarries and prehistoric rock art sites. The byway connects several museums and visitor centers dedicated to prehistoric discoveries, while offering views of dramatic red rock canyons and high desert landscapes.",
  
  "Going-to-the-Sun Road": "This engineering marvel in Montana's Glacier National Park spans 50 miles through the park's wild interior. The road, completed in 1932, crosses the Continental Divide at Logan Pass (6,646 feet), offering spectacular views of glacier-carved valleys, pristine alpine meadows, and rugged mountain peaks.",
  
  "Hana Highway": "This 64-mile scenic drive along Maui's northeastern coast features 620 curves and 59 bridges. The road offers stunning views of tropical rainforests, waterfalls, and dramatic seascapes. The journey includes access to black sand beaches, botanical gardens, and traditional Hawaiian villages.",
  
  "Pacific Coast Highway": "California's Pacific Coast Highway (State Route 1) is one of America's most celebrated scenic drives. The route hugs the state's western edge, offering dramatic views of the Pacific Ocean, rugged coastline, and mountains. Notable sections include Big Sur, where mountains plunge into the sea creating spectacular vistas.",
  
  "Million Dollar Highway": "Part of the San Juan Skyway in Colorado, this 25-mile section of US 550 between Silverton and Ouray is known for its white-knuckle hairpin turns and stunning mountain views. The road, built in the late 1880s, climbs to heights over 11,000 feet, offering views of abandoned mines, waterfalls, and peaks of the San Juan Mountains.",
  
  "Natchez Trace Parkway": "This 444-mile route from Nashville, Tennessee to Natchez, Mississippi follows a historic travel corridor used by Native Americans and early settlers. The parkway offers a peaceful drive through diverse landscapes including forests, farmland, and cypress swamps, with numerous historical sites and nature trails along the way.",
  
  "Overseas Highway": "This 113-mile highway connects the Florida Keys, running from Key Largo to Key West. Built on the former overseas railroad's right-of-way, the route features 42 bridges over the waters of the Atlantic Ocean, Florida Bay, and the Gulf of Mexico, offering stunning views of the Caribbean-like waters.",
  
  "Road to Hana": "This 64-mile scenic drive along Maui's northeastern coast features over 600 curves and 59 bridges. Known for its stunning tropical landscapes, the road passes by numerous waterfalls, black sand beaches, rainbow eucalyptus trees, and offers panoramic views of Maui's coastline.",
  
  "Seward Highway": "This 127-mile highway connecting Anchorage to Seward, Alaska, offers some of the most spectacular scenery in the state. The route passes between the Chugach Mountains and the waters of Turnagain Arm, offering opportunities to view glaciers, wildlife, and dramatic tidal changes.",
  
  "Trail Ridge Road": "This 48-mile route through Colorado's Rocky Mountain National Park is the highest continuous paved road in the United States, reaching an elevation of 12,183 feet. The road offers spectacular views of the Rocky Mountains, alpine wildflower meadows, and opportunities to view wildlife like elk and bighorn sheep."
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Get existing byways
    const { data: byways, error: fetchError } = await supabase
      .from('scenic_byways')
      .select('byway_name, description');
    
    if (fetchError) throw fetchError;

    // Update descriptions where available
    for (const byway of byways) {
      if (descriptions[byway.byway_name] && !byway.description) {
        const { error: updateError } = await supabase
          .from('scenic_byways')
          .update({ description: descriptions[byway.byway_name] })
          .eq('byway_name', byway.byway_name);
        
        if (updateError) throw updateError;
        
        console.log(`Updated description for: ${byway.byway_name}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Descriptions updated successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
