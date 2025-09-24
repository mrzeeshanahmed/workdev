import { createClient } from '@supabase/supabase-js'

// Load Supabase config from environment. DO NOT hardcode keys in source.
// Use optional chaining and guards so importing this module in non-browser
// contexts (or during tests) won't throw at module-evaluation time.
const _supabaseUrl = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
	? (import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
	: (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)

const _supabaseAnonKey = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
	? (import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
	: (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)

/**
 * Create and return a Supabase client.
 * This throws if configuration is missing — call when you expect config to exist.
 */
export function createSupabaseClient() {
	if (!_supabaseUrl || !_supabaseAnonKey) {
		throw new Error('Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.')
	}
	return createClient(_supabaseUrl, _supabaseAnonKey)
}

/**
 * Convenience: a client created only when config is available, otherwise `null`.
 * Importing this module will not throw.
 */
export const supabase = (_supabaseUrl && _supabaseAnonKey) ? createClient(_supabaseUrl, _supabaseAnonKey) : null
