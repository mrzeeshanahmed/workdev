import supabase from '../lib/supabaseClient';
export async function getProfile(id) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error)
        throw error;
    return data;
}
export async function updateProfile(id, changes) {
    const { data, error } = await supabase.from('profiles').update(changes).eq('id', id).select().single();
    if (error)
        throw error;
    return data;
}
export async function listProfiles() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error)
        throw error;
    return data;
}
export async function toggleVetting(id, isVetted) {
    const { data, error } = await supabase.from('profiles').update({ is_vetted: isVetted }).eq('id', id).select().single();
    if (error)
        throw error;
    return data;
}
export default { getProfile, updateProfile };
