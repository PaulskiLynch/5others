const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function hasSupabaseBrowserEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasSupabaseAdminEnv() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function getSupabaseBrowserEnv() {
  if (!hasSupabaseBrowserEnv()) {
    throw new Error("Supabase browser environment variables are missing.");
  }

  return {
    url: env.supabaseUrl!,
    anonKey: env.supabaseAnonKey!,
  };
}

export function getSupabaseAdminEnv() {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return {
    url: env.supabaseUrl!,
    serviceRoleKey: env.supabaseServiceRoleKey!,
  };
}
