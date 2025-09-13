import React, { useState } from 'react'
import { updateProfile } from '../../services/profiles.service'

type Props = {
  userId: string
  initial?: { display_name?: string; full_name?: string }
}

export default function OnboardingForm({ userId, initial }: Props) {
  const [displayName, setDisplayName] = useState(initial?.display_name || '')
  const [fullName, setFullName] = useState(initial?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // create or update profile row for the signed-in user
      await updateProfile(userId, { display_name: displayName, full_name: fullName })
    } catch (err: any) {
      setError(err?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="displayName">Display name</label>
        <input id="displayName" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </form>
  )
}
