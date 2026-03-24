export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const projectId =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ||
  (supabaseUrl ? supabaseUrl.replace('https://', '').replace('.supabase.co', '') : '');
