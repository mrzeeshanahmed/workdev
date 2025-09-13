import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL')
const SUPABASE_ANON = Deno.env.get('VITE_SUPABASE_ANON_KEY')
const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON ?? '')

serve(async (req, ctx) => {
  // TODO T007: implement profile GET/PUT per contract
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop() || ''
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 404 })
      return new Response(JSON.stringify({ profile: data }), { status: 200 })
    }
    if (req.method === 'PUT') {
      const body = await req.json()
      const { data, error } = await supabase.from('profiles').update(body).eq('id', id).select().single()
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
      return new Response(JSON.stringify({ profile: data }), { status: 200 })
    }
    return new Response(null, { status: 405 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
