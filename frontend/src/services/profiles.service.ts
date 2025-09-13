import supabase from '../lib/supabaseClient'

export type Profile = {
  id: string
  role?: string
  full_name?: string
  display_name?: string
  avatar_url?: string
  bio?: string
}

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error) throw error
  return data as Profile
}

export async function updateProfile(id: string, changes: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').update(changes).eq('id', id).select().single()
  if (error) throw error
  return data as Profile
}

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  return data as Profile[]
}

export async function toggleVetting(id: string, isVetted: boolean) {
  const { data, error } = await supabase.from('profiles').update({ is_vetted: isVetted }).eq('id', id).select().single()
  if (error) throw error
  return data as Profile
}

export default { getProfile, updateProfile }
