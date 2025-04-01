import { NextApiRequest, NextApiResponse } from 'next';
import stripeService from '../../api/stripe-service';
import { supabase } from '../../context/AuthContext';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if the user has a stripe_customer_id in user_metadata
      let stripeCustomerId = user.user_metadata?.stripe_customer_id;

      if (!stripeCustomerId) {
        // Create a new Stripe customer
        const customer = await stripeService.createCustomer({
          email: user.email || '',
          name: user.email?.split('@')[0] || '',
          metadata: {
            user_id: user.id,
          },
        });

        stripeCustomerId = customer.id;

        // Update the user in Supabase with the stripe_customer_id
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: {
              stripe_customer_id: stripeCustomerId,
            },
          });

          if (error) {
            console.error('Error updating user metadata:', error);
            return res.status(500).json({ message: 'Failed to update user metadata' });
          }
        } catch (error) {
          console.error('Error updating user metadata:', error);
          return res.status(500).json({ message: 'Failed to update user metadata' });
        }
        console.log('stripeCustomerId', stripeCustomerId);
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.origin}/subscription`,
      });

      // Return the URL of the Stripe billing portal session
      res.status(200).json({ url: portalSession.url });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to create/link Stripe customer' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
