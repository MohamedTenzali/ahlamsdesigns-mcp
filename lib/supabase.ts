import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
