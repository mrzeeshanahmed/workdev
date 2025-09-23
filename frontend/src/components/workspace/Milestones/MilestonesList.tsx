import * as React from 'react'

export default function MilestonesList({ workspaceId }: any) {
  const [list, setList] = React.useState<any[]>([])

  async function load() {
    const res = await fetch(`/api/workspaces/${workspaceId}/milestones`)
    const data = await res.json()
    setList(data.milestones || [])
  }

  React.useEffect(() => { load() }, [workspaceId])

  async function submit(id: string) {
    await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/submit`, { method: 'POST' })
    load()
  }

  async function approve(id: string) {
    await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/approve`, { method: 'POST' })
    load()
  }

  async function requestRevision(id: string) {
    const reason = prompt('Reason for revision:')
    if (!reason) return
    await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/request-revision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) })
    load()
  }

  async function edit(id: string) {
    const title = prompt('New title:')
    const description = prompt('New description:')
    if (!title && !description) return
    await fetch(`/api/workspaces/${workspaceId}/milestones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) })
    load()
  }

  return (
    <div>
      <h4>Milestones</h4>
      <ul>
        {list.map((m: any) => (
          <li key={m.id || m.milestoneId} style={{ marginBottom: 12 }}>
            <div><strong>{m.title || m.title}</strong> — <em>{m.state}</em></div>
            <div style={{ fontSize: 13, color: '#444' }}>{m.description}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => edit(m.id || m.milestoneId)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => submit(m.id || m.milestoneId)} style={{ marginRight: 8 }}>Submit</button>
              <button onClick={() => approve(m.id || m.milestoneId)} style={{ marginRight: 8 }}>Approve</button>
              <button onClick={() => requestRevision(m.id || m.milestoneId)}>Request revision</button>
            </div>
            {/* simple audit trail */}
            {m.history && m.history.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                <strong>History:</strong>
                <ul>
                  {m.history.map((h: any, i: number) => (
                    <li key={i}>{h.action} — {h.at}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
