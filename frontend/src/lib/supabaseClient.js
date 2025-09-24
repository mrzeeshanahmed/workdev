import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
// Minimal stub factory (module-level)
function makeFrom(_tableName) {
    return {
        select: function () { return this; },
        eq: function () { return this; },
        order: function () { return this; },
        // insert should return an object that supports .select().single()
        insert: function (rows) {
            const inserted = rows && rows.length ? rows[0] : rows;
            return {
                select: function () {
                    return {
                        single: async function () {
                            return { data: inserted, error: null };
                        }
                    };
                }
            };
        },
        // fallback single when called directly
        single: async function () { return { data: null, error: null }; }
    };
}
// During test runs or environments without Supabase config, export a small no-op stub
let supabase;
if (!supabaseUrl) {
    supabase = {
        from: (tableName) => makeFrom(tableName),
        auth: { signIn: async () => ({ user: null, session: null }) },
        channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
        removeChannel: () => { },
    };
}
else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}
export { supabase };
export default supabase;
