import Stripe from 'stripe';

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

interface StripeEnv {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

export async function handleStripeRequest(request: Request, env: StripeEnv): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);
  let path;
  try {
    const url = new URL(request.url);
    path = url.pathname.replace('/api/stripe', '');
  } catch (error) {
    // If URL parsing fails, extract path directly from request
    path = request.url.replace('/api/stripe', '').split('?')[0];
  }

  // Initialize Stripe with the secret key from environment variables
  const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
  });

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': new URL(request.url).origin,
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  try {
    // Route requests to the appropriate handler
    if (path.startsWith('/customers')) {
      return handleCustomers(request, stripe, path);
    } else if (path.startsWith('/checkout-sessions')) {
      return handleCheckoutSessions(request, stripe, path);
    } else if (path.startsWith('/portal-sessions')) {
      return handlePortalSessions(request, stripe);
    } else if (path.startsWith('/subscriptions')) {
      return handleSubscriptions(request, stripe, path);
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle customer-related operations
async function handleCustomers(
  request: Request,
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  interface CreateCustomerRequest {
    email: string;
    name: string;
  }

  // Get customer by ID
  if (request.method === 'GET' && path.match(/\/customers\/[^\/]+$/)) {
    const customerId = path.split('/').pop()!;

    const customer = await stripe.customers.retrieve(customerId);

    return new Response(JSON.stringify(customer), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get customer subscriptions
  if (
    request.method === 'GET' &&
    path.match(/\/customers\/[^\/]+\/subscriptions$/)
  ) {
    const customerId = path.split('/').slice(-2)[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    return new Response(JSON.stringify(subscriptions), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Create a new customer
  if (request.method === 'POST' && path === '/customers') {
    const { email, name } = (await request.json()) as CreateCustomerRequest;

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });

    return new Response(JSON.stringify(customer), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle checkout session operations
async function handleCheckoutSessions(
  request: Request,
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  interface CreateCheckoutSessionRequest {
    priceId: string;
    customerId: string;
    successUrl: string;
    cancelUrl: string;
  }

  // Create a new checkout session
  if (request.method === 'POST' && path === '/checkout-sessions') {
    const { priceId, customerId, successUrl, cancelUrl } =
      (await request.json()) as CreateCheckoutSessionRequest;

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

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Retrieve a checkout session
  if (request.method === 'GET' && path.match(/\/checkout-sessions\/[^\/]+$/)) {
    const sessionId = path.split('/').pop()!;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'subscription.default_payment_method'],
    });

    return new Response(JSON.stringify(session), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle customer portal sessions
async function handlePortalSessions(
  request: Request,
  stripe: Stripe
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  interface CreatePortalSessionRequest {
    customerId: string;
    returnUrl: string;
  }

  // Create a new portal session
  if (request.method === 'POST') {
    const { customerId, returnUrl } =
      (await request.json()) as CreatePortalSessionRequest;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle subscription operations
async function handleSubscriptions(
  request: Request,
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  interface UpdateSubscriptionRequest {
    priceId: string;
  }

  // Get subscription by ID
  if (request.method === 'GET' && path.match(/\/subscriptions\/[^\/]+$/)) {
    const subscriptionId = path.split('/').pop()!;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'customer'],
    });

    return new Response(JSON.stringify(subscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Update subscription
  if (request.method === 'PATCH' && path.match(/\/subscriptions\/[^\/]+$/)) {
    const subscriptionId = path.split('/').pop()!;
    const { priceId } = (await request.json()) as UpdateSubscriptionRequest;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update the subscription with the new price
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'create_prorations',
        payment_behavior: 'pending_if_incomplete',
      }
    );

    return new Response(JSON.stringify(updatedSubscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Cancel subscription
  if (
    request.method === 'POST' && path.match(/\/subscriptions\/[^\/]+\/cancel$/)
  ) {
    const subscriptionId = path.split('/').slice(-2)[0];

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return new Response(JSON.stringify(subscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export async function createCheckoutSessionAndGetUrl(
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
  env: StripeEnv
): Promise<string | null> {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });

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
    return session.url || null;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}
