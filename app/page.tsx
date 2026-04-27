export default function Home() {
  const checks = {
    MCP_BEARER_TOKEN: !!process.env.MCP_BEARER_TOKEN,
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const tools = [
    "list_ad_accounts", "get_account_details", "list_campaigns",
    "list_adsets", "list_ads", "get_ad_creative", "list_pages",
    "list_instagram_accounts", "get_campaign_insights",
    "set_campaign_status", "set_adset_status", "set_ad_status",
    "update_budget", "create_campaign", "create_adset",
    "create_ad_creative", "create_ad", "update_ad_creative",
    "list_audiences", "create_custom_audience",
    "add_users_to_audience", "create_lookalike_audience",
  ];

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", background: "#0f0f0f", color: "#e0e0e0", minHeight: "100vh" }}>
      <h1 style={{ color: "#c9a84c", marginBottom: "0.5rem" }}>🌸 Ahlamsdesigns MCP Server</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Meta Ads connector voor Claude AI</p>

      <h2 style={{ color: "#c9a84c" }}>Environment Status</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(checks).map(([key, ok]) => (
          <li key={key} style={{ marginBottom: "0.4rem" }}>
            <span style={{ color: ok ? "#4ade80" : "#f87171" }}>{ok ? "✅" : "❌"}</span> {key}
          </li>
        ))}
      </ul>

      <h2 style={{ color: "#c9a84c", marginTop: "2rem" }}>Beschikbare Tools ({tools.length})</h2>
      <ul style={{ listStyle: "none", padding: 0, columns: 2 }}>
        {tools.map((t) => (
          <li key={t} style={{ marginBottom: "0.3rem", color: "#a0a0a0" }}>→ {t}</li>
        ))}
      </ul>
    </main>
  );
}
