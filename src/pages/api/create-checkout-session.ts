import { handleStripeRequest } from '../../api/stripe-api';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;
      const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET;
      if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
        console.error('Missing Stripe environment variables');
        res.status(500).json({ error: 'Missing Stripe environment variables' });
        return;
      }

      const env = {
        STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: STRIPE_WEBHOOK_SECRET,
      };

      // Convert Express request to Web API Request format
      const webRequest = new Request(req.url, {
        method: req.method,
        headers: new Headers({
          'Content-Type': 'application/json',
          ...req.headers
        }),
        body: JSON.stringify(req.body)
      });

      const response = await handleStripeRequest(webRequest, env);
      const responseData = await response.json();
      res.status(response.status).json(responseData);
    } catch (error) {
      console.error('Error in /api/create-checkout-session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
