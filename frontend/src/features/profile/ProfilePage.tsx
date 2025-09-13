import React, { useEffect, useState } from 'react'
import { getProfile, Profile } from '../../services/profiles.service'

type Props = { id: string }

export default function ProfilePage({ id }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProfile(id).then((p) => { if (mounted) setProfile(p) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Not found</div>

  return (
    <div>
      <h2>{profile.display_name || profile.full_name || profile.id}</h2>
      <p>{profile.bio}</p>
      <div>Vetted: {String((profile as any).is_vetted === true)}</div>
    </div>
  )
}
