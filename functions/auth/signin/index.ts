import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL')
const SUPABASE_ANON = Deno.env.get('VITE_SUPABASE_ANON_KEY')

const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON ?? '')

serve(async (req) => {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: 'missing email or password' }), { status: 400 })

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 401 })
    return new Response(JSON.stringify({ session: data }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
