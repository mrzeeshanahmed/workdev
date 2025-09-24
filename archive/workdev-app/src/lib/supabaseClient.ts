import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iiuittusmilrodxchdae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdWl0dHVzbWlscm9keGNoZGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NjAyNTksImV4cCI6MjA3MzMzNjI1OX0.2-t1Ki_MhOHtUSuffLLx7tiPqUR67ivZMLrXjuUeYAk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
