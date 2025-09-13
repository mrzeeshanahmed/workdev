import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL')
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE ?? '')

serve(async (req) => {
  try {
    const body = await req.json()
    const { project_id, reviewer_id, rating, comment } = body
    const { data, error } = await supabase.from('reviews').insert([{ project_id, reviewer_id, rating, comment }]).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(JSON.stringify({ review: data }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
