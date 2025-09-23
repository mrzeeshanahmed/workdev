import * as React from 'react'

type Msg = { id: string; author_id: string; body: string; created_at: string }

export default function Messages({ workspaceId }: { workspaceId: string }) {
  const [messages, setMessages] = React.useState<Msg[]>([])

  React.useEffect(() => {
    fetch(`/api/workspaces/${workspaceId}/messages`).then(r => r.json()).then(d => setMessages(d.messages || []))
  }, [workspaceId])

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((m: Msg) => (
          <li key={m.id}>
            <strong>{m.author_id}</strong>: {m.body}
            <div style={{ fontSize: 12, color: '#666' }}>{m.created_at}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
