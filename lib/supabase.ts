import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase env vars missing");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

export async function logToolCall(data: {
  tool_name: string;
  arguments: any;
  result?: any;
  error?: string;
  duration_ms: number;
  ad_account_id?: string;
}) {
  try {
    await supabase.from("meta_tool_calls").insert(data);
  } catch (e) {
    console.error("Log error:", e);
  }
}

export async function resolveAlias(input: string): Promise<string> {
  if (input.startsWith("act_")) return input;
  const { data } = await supabase
    .from("meta_account_aliases")
    .select("ad_account_id")
    .eq("alias", input)
    .single();
  return data?.ad_account_id ?? input;
}
