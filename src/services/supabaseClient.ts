import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url?: string;
  hasAnonKey: boolean;
  statusText: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    url: supabaseUrl || undefined,
    hasAnonKey: Boolean(supabaseAnonKey),
    statusText: isSupabaseConfigured
      ? 'Connected to Supabase PostgreSQL'
      : 'Local / Offline Reactive Engine Active (Supabase Not Configured)',
  };
}
