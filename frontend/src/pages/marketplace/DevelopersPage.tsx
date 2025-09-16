import React, { useEffect, useState } from 'react'
import DeveloperCard from '../../components/marketplace/DeveloperCard'

const SAMPLE = [
  { id: 'd1', name: 'Ada Lovelace', headline: 'Backend Engineer', skills: ['python', 'systems'] },
  { id: 'd2', name: 'Grace Hopper', headline: 'Frontend Engineer', skills: ['javascript', 'accessibility'] }
]

export default function DevelopersPage() {
  const [devs, setDevs] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/public/developers')
        if (!res.ok) throw new Error('Network response not ok')
        const data = await res.json()
        if (mounted) setDevs(Array.isArray(data) ? data : data.items || [])
      } catch (err: any) {
        console.warn('Failed to fetch developers, falling back to sample', err)
        if (mounted) {
          setError('Could not load live developers; showing samples')
          setDevs(SAMPLE)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h1>Developers</h1>
      {loading && <p className="loading">Loading developers…</p>}
      {error && <p className="loading">{error}</p>}
      {devs && devs.map(d => (
        <DeveloperCard key={d.id} id={d.id} name={d.name} headline={d.headline} skills={d.skills} />
      ))}
    </div>
  )
}
