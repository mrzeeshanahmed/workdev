import * as React from 'react'

export default function MilestonesCreate({ workspaceId, onCreated }: any) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)

  async function submit(e: any) {
    e.preventDefault()
    const res = await fetch(`/api/workspaces/${workspaceId}/milestones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) })
    if (res.status === 201) {
      const data = await res.json()
      onCreated?.(data)
      // if user selected a file, attempt to upload it to files endpoint (best-effort)
      if (file) {
        try {
          const form = new FormData()
          form.append('file', file)
          await fetch(`/api/workspaces/${workspaceId}/files`, { method: 'POST', body: form })
        } catch (err) {
          console.warn('file upload failed', err)
        }
      }
      setTitle('')
      setDescription('')
    } else {
      alert('failed')
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Attachment (optional)</label>
        <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
      </div>
      <button type="submit">Create Milestone</button>
    </form>
  )
}
