import Stripe from 'stripe';

async function createCheckoutSession(
  stripe: Stripe,
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
// Helper function to generate CORS headers
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}
export async function handleCreateCheckoutSession(
  request: Request,
  stripe: Stripe
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  interface CreateCheckoutSessionRequest {
    priceId: string;
    customerId: string;
    successUrl: string;
    cancelUrl: string;
  }

  if (request.method === 'POST') {
    try {
      const body = await request.text();
      if (!body) {
        return new Response(JSON.stringify({ error: 'Empty request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      const { priceId, customerId, successUrl, cancelUrl } = parsedBody as CreateCheckoutSessionRequest;

      if (!priceId || !customerId || !successUrl || !cancelUrl) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const session = await createCheckoutSession(stripe, priceId, customerId, successUrl, cancelUrl);
      return new Response(JSON.stringify({ id: session.id, url: session.url }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
