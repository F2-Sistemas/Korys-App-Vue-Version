import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://vkxawxuiyckrueemjzit.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreGF3eHVpeWNrcnVlZW1qeml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTMzNTcsImV4cCI6MjA1MDcyOTM1N30.a7qcjRCRE1Nk-XYfVnhJNJEpS-Uu6fMq6bBYW6A9pZs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
