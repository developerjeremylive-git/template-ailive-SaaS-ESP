    -- Add stripe_customer_id column to auth.users table
    ALTER TABLE auth.users
    ADD COLUMN IF NOT EXISTS stripe_customer_id text;

    -- Create an index on stripe_customer_id for better query performance
    CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON auth.users(stripe_customer_id);

    -- Update existing users with stripe_customer_id from metadata
    UPDATE auth.users
    SET stripe_customer_id = raw_user_meta_data->>'stripe_customer_id'
    WHERE raw_user_meta_data->>'stripe_customer_id' IS NOT NULL;