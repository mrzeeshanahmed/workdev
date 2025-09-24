import * as React from 'react'

type Props = {
  workspaceId: string
  onCreated?: (milestone: any) => void
}

export default function MilestonesCreate({ workspaceId, onCreated }: Props) {
  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [file, setFile] = React.useState<File | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await fetch(`/api/workspaces/${workspaceId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

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
      setFile(null)
    } else {
      // show a helpful message
      const text = await res.text().catch(() => null)
      alert(`Failed to create milestone${text ? `: ${text}` : ''}`)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files && e.currentTarget.files.length ? e.currentTarget.files[0] : null
    setFile(f)
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="milestone-title">Title</label>
        <input id="milestone-title" value={title} onChange={e => setTitle(e.currentTarget.value)} placeholder="e.g. Design mockups" />
      </div>
      <div>
        <label htmlFor="milestone-description">Description</label>
        <textarea id="milestone-description" value={description} onChange={e => setDescription(e.currentTarget.value)} placeholder="Describe the milestone" />
      </div>
      <div>
        <label htmlFor="milestone-file">Attachment (optional)</label>
        <input id="milestone-file" type="file" onChange={onFileChange} aria-label="Milestone attachment" />
      </div>
      <button type="submit">Create Milestone</button>
    </form>
  )
}
