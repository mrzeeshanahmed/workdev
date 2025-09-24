import supabase from '../lib/supabaseClient';
export async function createProject(payload) {
    const { data, error } = await supabase.from('projects').insert(payload).select().single();
    if (error)
        throw error;
    return data;
}
export async function getProject(id) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error)
        throw error;
    return data;
}
export default { createProject, getProject };
