import { createClient } from '@supabase/supabase-js';

// Helper to safely get env variables in both Vite and Next.js environments.
// Static access is required for client-side bundlers to perform replacement.
const supabaseUrl =
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : '') ||
    // @ts-ignore
    (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : '') ||
    '';

const supabaseAnonKey =
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : '') ||
    // @ts-ignore
    (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : '') ||
    '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
