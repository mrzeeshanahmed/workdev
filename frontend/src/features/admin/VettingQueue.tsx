import React, { useEffect, useState } from 'react'
import { listProfiles, toggleVetting, Profile } from '../../services/profiles.service'

export default function VettingQueue() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    listProfiles().then((p) => { if (mounted) setProfiles(p) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function toggle(id: string, current: any) {
    try {
      const updated = await toggleVetting(id, !current)
      setProfiles((s) => s.map((p) => (p.id === id ? updated : p)))
    } catch (err) {
      // noop for now
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h3>Vetting Queue</h3>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>
            <span>{p.display_name || p.full_name || p.id}</span>
            <button onClick={() => toggle(p.id, (p as any).is_vetted)}>{(p as any).is_vetted ? 'Unvet' : 'Vet'}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
