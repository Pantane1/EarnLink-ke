
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';

// Only initialize if we have a valid-looking URL
const isValidConfig = supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your-project');

export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseEnabled = () => !!supabase;
