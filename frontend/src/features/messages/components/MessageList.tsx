import React, { useState } from 'react'
import { useMessages } from '../useMessages'

type Props = {
  conversationId: string
  currentUserId: string
}

export function MessageList({ conversationId, currentUserId }: Props) {
  const { messages, loading, sendMessage } = useMessages(conversationId, currentUserId)
  const [text, setText] = useState('')

  // ...existing code...

  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      <ul data-testid="messages">
        {messages.map((m) => (
          <li key={m.id} data-testid={`msg-${m.id}`}>{m.text}</li>
        ))}
      </ul>
      <form onSubmit={async (e) => { e.preventDefault(); if (!text) return; try { await sendMessage(text); setText('') } catch (err) { /* noop */ } }}>
        <input data-testid="message-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button data-testid="send-btn" type="submit">Send</button>
      </form>
    </div>
  )
}
