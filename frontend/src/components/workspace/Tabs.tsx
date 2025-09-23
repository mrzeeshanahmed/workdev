import * as React from 'react'

type TabsProps = {
  active?: string
  onChange: (tab: string) => void
}

export default function Tabs({ active = 'milestones', onChange }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button onClick={() => onChange('milestones')} style={{ fontWeight: active === 'milestones' ? 'bold' : 'normal' }}>Milestones</button>
      <button onClick={() => onChange('messages')} style={{ fontWeight: active === 'messages' ? 'bold' : 'normal' }}>Messages</button>
      <button onClick={() => onChange('files')} style={{ fontWeight: active === 'files' ? 'bold' : 'normal' }}>Files</button>
      <button onClick={() => onChange('details')} style={{ fontWeight: active === 'details' ? 'bold' : 'normal' }}>Details</button>
    </div>
  )
}
