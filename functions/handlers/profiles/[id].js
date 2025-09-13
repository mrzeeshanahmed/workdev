module.exports = async function handler(req) {
  const { createClient } = require('@supabase/supabase-js')
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
  const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

  // req.path will be like /profiles/:id
  const parts = req.path.split('/')
  const id = parts[parts.length - 1]
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) return { status: 404, body: { error: error.message } }
    return { status: 200, body: { profile: data } }
  }
  if (req.method === 'PUT') {
    const { data, error } = await supabase.from('profiles').update(req.body).eq('id', id).select().single()
    if (error) return { status: 400, body: { error: error.message } }
    return { status: 200, body: { profile: data } }
  }
  return { status: 405, body: { error: 'method not allowed' } }
}
