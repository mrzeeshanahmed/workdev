module.exports = async function handler(req) {
  const { createClient } = require('@supabase/supabase-js')
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  const { email, password } = req.body || {}
  if (!email || !password) return { status: 400, body: { error: 'missing email or password' } }
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) return { status: 400, body: { error: error.message } }
  return { status: 201, body: { user: data.user } }
}
