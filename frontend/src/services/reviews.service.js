import supabase from '../lib/supabaseClient';
export async function createReview(payload) {
    const { data, error } = await supabase.from('reviews').insert(payload).select().single();
    if (error)
        throw error;
    return data;
}
export async function getReputation(profileId) {
    const { data, error } = await supabase.from('reputation').select('*').eq('profile_id', profileId).single();
    if (error)
        throw error;
    return data;
}
export default { createReview };
