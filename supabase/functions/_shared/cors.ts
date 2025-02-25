
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const cors = (req: Request, options: { status?: number; body?: string } = {}) => {
  const { status = 200, body = '' } = options;
  return new Response(body, {
    status,
    headers: corsHeaders,
  });
};
