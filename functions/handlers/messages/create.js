module.exports = async function handler(req) {
  const { createClient } = require('@supabase/supabase-js')
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  const { sender_id, recipient_id, text } = req.body || {}
  if (!sender_id || !recipient_id || !text) return { status: 400, body: { error: 'missing fields' } }
  const { data, error } = await supabase.from('messages').insert([{ sender_id, recipient_id, text }]).select().single()
  if (error) return { status: 400, body: { error: error.message } }
  return { status: 201, body: { message: data } }
}
