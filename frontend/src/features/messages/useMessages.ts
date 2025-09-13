import { useState, useEffect, useCallback } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

type Message = {
  id?: string
  sender_id: string
  recipient_id: string
  text: string
  created_at?: string
}

// Lazy client factory so tests can mock createClient and set env vars before use.
function getSupabase(): SupabaseClient | null {
  try {
    const url = process.env.VITE_SUPABASE_URL || ''
    const anon = process.env.VITE_SUPABASE_ANON_KEY || ''
    if (!url || !anon) return null
    return createClient(url, anon)
  } catch (e) {
    return null
  }
}

export function useMessages(conversationId: string, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let sub: any = null
    async function init() {
      setLoading(true)
      // initial fetch (best-effort)
      const client = getSupabase()
      if (client) {
      const res = await client.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
        const data = (res as any).data as Message[] | null
        if (data) {
          // Preserve any existing optimistic (temporary) messages while loading server data.
                setMessages((prev) => {
                  const temps = prev.filter((m) => typeof m.id === 'string' && m.id.startsWith('tmp-'))
                  return [...data, ...temps]
                })
        }
        // subscribe to realtime changes
        // @ts-expect-error - event typing from supabase client
        sub = client.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
          const newMsg = payload.new as Message
          setMessages((m) => [...m, newMsg])
        }).subscribe()
      }
      setLoading(false)
    }
    init()
    return () => { if (sub) {
      const client = getSupabase()
      client?.removeChannel?.(sub)
    } }
  }, [conversationId])

  const sendMessage = useCallback(async (text: string) => {
    // optimistic id
    const tempId = `tmp-${Date.now()}`
    const optimistic: Message = { id: tempId, sender_id: currentUserId, recipient_id: conversationId, text, created_at: new Date().toISOString() }
    setMessages((m) => [...m, optimistic])
  // DEBUG: log optimistic add (tests will show this in Vitest output)
  // optimistic add

    try {
      const client = getSupabase()
      if (!client) throw new Error('no supabase')
  const res = await client.from('messages').insert([{ sender_id: currentUserId, recipient_id: conversationId, text }]).select().single()
  const data = (res as any).data as Message | null
  const error = (res as any).error
  if (error) throw error
  // replace optimistic message with real one
  setMessages((m) => m.map((msg) => (msg.id === tempId ? (data as any) : msg)))
  return data
    } catch (err) {
      // on error, remove optimistic or mark failed
      setMessages((m) => m.filter((msg) => msg.id !== tempId))
      throw err
    }
  }, [conversationId, currentUserId])

  return { messages, loading, sendMessage }
}
