// api/_supabase.js
const { createClient } = require('@supabase/supabase-js')

// Use the service role key on the server — it bypasses RLS.
// NEVER expose this key in client-side code.
const getServiceClient = () =>
  createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

// Anon client for operations that should respect RLS
const getAnonClient = () =>
  createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

module.exports = { getServiceClient, getAnonClient }