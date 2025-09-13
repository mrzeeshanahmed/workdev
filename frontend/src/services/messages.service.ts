import supabase from '../lib/supabaseClient'

export async function sendMessage(payload: { sender_id: string; recipient_id: string; body: string }) {
  const { data, error } = await supabase.from('messages').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function listConversationMessages(conversation_id: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversation_id)
  if (error) throw error
  return data
}

export default { sendMessage, listConversationMessages }
