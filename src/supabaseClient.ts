import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeaekcwdhrocqeitqaul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYWVrY3dkaHJvY3FlaXRxYXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzQyMTIsImV4cCI6MjA2NjM1MDIxMn0.7m_1egnlIti-4KCN9by2AhEnaPkGcHoKufvrh-ezTOI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 