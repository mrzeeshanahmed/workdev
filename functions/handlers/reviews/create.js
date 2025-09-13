module.exports = async function handler(req) {
  const { createClient } = require('@supabase/supabase-js')
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  const { project_id, reviewer_id, rating, comment } = req.body || {}
  if (!project_id || !reviewer_id || rating == null) return { status: 400, body: { error: 'missing fields' } }
  const { data, error } = await supabase.from('reviews').insert([{ project_id, reviewer_id, rating, comment }]).select().single()
  if (error) return { status: 400, body: { error: error.message } }
  return { status: 201, body: { review: data } }
}
