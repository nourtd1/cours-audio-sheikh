import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ondxodxaueszssxywynf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZHhvZHhhdWVzenNzeHl3eW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjM5ODcsImV4cCI6MjA2NTEzOTk4N30.fesgHC95F_zRUHMrR-ogTVvA0pOY7S8OVhHgwAisotw';

export const supabase = createClient(supabaseUrl, supabaseKey); 