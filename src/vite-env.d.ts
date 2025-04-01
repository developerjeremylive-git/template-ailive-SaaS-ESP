/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_API_URL: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_PAYPAL_CLIENT_SECRET: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
