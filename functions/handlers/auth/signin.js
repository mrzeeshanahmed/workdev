module.exports = async function handler(req) {
  const { createClient } = require('@supabase/supabase-js')
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
  const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

  const { email, password } = req.body || {}
  if (!email || !password) return { status: 400, body: { error: 'missing email or password' } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { status: 401, body: { error: error.message } }
  return { status: 200, body: { session: data } }
}
