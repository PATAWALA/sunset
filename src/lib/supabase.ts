import { createClient } from '@supabase/supabase-js'

// FORCER les valeurs pour tester
const supabaseUrl = 'https://afxjjpylilnzfpjcrhfd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGpqcHlsaWxuemZwamNyaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTU5MjcsImV4cCI6MjA5MjMzMTkyN30.bl7JoEcn0M9NModZLv5le8YWJIOaojHCwmcZjJB5d7I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)