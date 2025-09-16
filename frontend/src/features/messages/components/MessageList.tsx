import React, { useState } from 'react'
import { useMessages } from '../useMessages'
import styles from './MessageList.module.css'

type Props = {
  conversationId: string
  currentUserId: string
}

export function MessageList({ conversationId, currentUserId }: Props) {
  const { messages, loading, sendMessage } = useMessages(conversationId, currentUserId)
  const [text, setText] = useState('')
  // submit handler extracted for readability and easier testing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return
    try {
      await sendMessage(text)
      setText('')
    } catch (err) {
      // swallow send errors for now; UI can show toast in future
    }
  }

  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      <ul data-testid="messages">
        {messages.map((m) => (
          <li key={m.id} data-testid={`msg-${m.id}`}>{m.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-input" className={styles.visuallyHidden}>
          Message
        </label>
        <input id="message-input" data-testid="message-input" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} />
        <button data-testid="send-btn" type="submit">Send</button>
      </form>
    </div>
  )
}
