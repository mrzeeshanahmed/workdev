// @ts-nocheck
import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

// Support both Deno (Edge) and Node (dev server) environments
const SUPABASE_URL = (typeof Deno !== 'undefined' && Deno?.env?.get) ? Deno.env.get('VITE_SUPABASE_URL') : process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = (typeof Deno !== 'undefined' && Deno?.env?.get) ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') : process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE ?? '')

serve(async (req) => {
  try {
    const body = await req.json()
    const { sender_id, recipient_id, text } = body
    const { data, error } = await supabase.from('messages').insert([{ sender_id, recipient_id, text }]).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(JSON.stringify({ message: data }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
