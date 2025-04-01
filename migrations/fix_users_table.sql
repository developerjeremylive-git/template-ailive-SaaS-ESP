-- Drop the existing users table if it exists
DROP TABLE IF EXISTS public.users;

-- Create the users table with proper references to auth.users
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    username text,
    email text,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view and manage their own data
CREATE POLICY "Users can view and manage their own data"
    ON public.users
    FOR ALL
    USING (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT ON public.users TO authenticated;
GRANT INSERT, UPDATE ON public.users TO authenticated;