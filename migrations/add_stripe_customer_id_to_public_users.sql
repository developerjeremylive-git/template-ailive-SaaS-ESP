-- Add stripe_customer_id column to public.users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create an index on stripe_customer_id for better query performance
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON public.users(stripe_customer_id);

-- Add a unique constraint to ensure no duplicate stripe_customer_ids
ALTER TABLE public.users
ADD CONSTRAINT users_stripe_customer_id_unique UNIQUE (stripe_customer_id);

-- Update existing users with stripe_customer_id from auth.users if available
UPDATE public.users u
SET stripe_customer_id = au.stripe_customer_id
FROM auth.users au
WHERE u.id = au.id
AND au.stripe_customer_id IS NOT NULL;