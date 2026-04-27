export const toolDefinitions = [
  {
    name: "list_ad_accounts",
    description: "Toon alle Meta ad accounts gekoppeld aan dit token",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_account_details",
    description: "Haal details op van een specifiek ad account",
    inputSchema: {
      type: "object",
      properties: { account_id: { type: "string", description: "Ad account ID (act_xxx)" } },
      required: ["account_id"],
    },
  },
  {
    name: "list_campaigns",
    description: "Toon alle campagnes in een ad account",
    inputSchema: {
      type: "object",
      properties: { account_id: { type: "string" } },
      required: ["account_id"],
    },
  },
  {
    name: "list_adsets",
    description: "Toon alle advertentiesets in een campagne",
    inputSchema: {
      type: "object",
      properties: { campaign_id: { type: "string" } },
      required: ["campaign_id"],
    },
  },
  {
    name: "list_ads",
    description: "Toon alle advertenties in een advertentieset",
    inputSchema: {
      type: "object",
      properties: { adset_id: { type: "string" } },
      required: ["adset_id"],
    },
  },
  {
    name: "get_ad_creative",
    description: "Haal de creative op van een advertentie",
    inputSchema: {
      type: "object",
      properties: { creative_id: { type: "string" } },
      required: ["creative_id"],
    },
  },
  {
    name: "list_pages",
    description: "Toon alle Facebook paginas gekoppeld aan dit account",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "list_instagram_accounts",
    description: "Toon gekoppelde Instagram accounts",
    inputSchema: {
      type: "object",
      properties: { page_id: { type: "string" } },
      required: ["page_id"],
    },
  },
  {
    name: "get_campaign_insights",
    description: "Haal prestatie-inzichten op voor een campagne (bereik, klikken, kosten, leads)",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: { type: "string" },
        date_preset: { type: "string", description: "Bijv: last_30d, last_7d, yesterday" },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "set_campaign_status",
    description: "Zet een campagne aan of uit",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: { type: "string" },
        status: { type: "string", enum: ["ACTIVE", "PAUSED"] },
      },
      required: ["campaign_id", "status"],
    },
  },
  {
    name: "set_adset_status",
    description: "Zet een advertentieset aan of uit",
    inputSchema: {
      type: "object",
      properties: {
        adset_id: { type: "string" },
        status: { type: "string", enum: ["ACTIVE", "PAUSED"] },
      },
      required: ["adset_id", "status"],
    },
  },
  {
    name: "set_ad_status",
    description: "Zet een advertentie aan of uit",
    inputSchema: {
      type: "object",
      properties: {
        ad_id: { type: "string" },
        status: { type: "string", enum: ["ACTIVE", "PAUSED"] },
      },
      required: ["ad_id", "status"],
    },
  },
  {
    name: "update_budget",
    description: "Pas het dagbudget of totaalbudget aan van een advertentieset",
    inputSchema: {
      type: "object",
      properties: {
        adset_id: { type: "string" },
        daily_budget: { type: "number", description: "Dagbudget in centen (bijv. 1000 = €10)" },
        lifetime_budget: { type: "number", description: "Totaalbudget in centen" },
      },
      required: ["adset_id"],
    },
  },
  {
    name: "create_campaign",
    description: "Maak een nieuwe campagne aan (altijd PAUSED voor veiligheid)",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string" },
        name: { type: "string" },
        objective: { type: "string", description: "Bijv: OUTCOME_LEADS, OUTCOME_AWARENESS, OUTCOME_TRAFFIC" },
        special_ad_categories: { type: "array", items: { type: "string" } },
      },
      required: ["account_id", "name", "objective"],
    },
  },
  {
    name: "create_adset",
    description: "Maak een nieuwe advertentieset aan (altijd PAUSED voor veiligheid)",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: { type: "string" },
        name: { type: "string" },
        daily_budget: { type: "number", description: "In centen, bijv. 1000 = €10" },
        targeting: { type: "object", description: "Targeting object: geo, leeftijd, interesses" },
        optimization_goal: { type: "string" },
        billing_event: { type: "string" },
        page_id: { type: "string" },
      },
      required: ["campaign_id", "name", "daily_budget", "targeting", "optimization_goal", "billing_event", "page_id"],
    },
  },
  {
    name: "create_ad_creative",
    description: "Maak een nieuwe ad creative aan met tekst en afbeelding",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string" },
        name: { type: "string" },
        page_id: { type: "string" },
        message: { type: "string", description: "De advertentietekst" },
        link: { type: "string", description: "URL of WhatsApp link" },
        image_hash: { type: "string", description: "Hash van geüploade afbeelding" },
        call_to_action_type: { type: "string", description: "Bijv: MESSAGE_PAGE, LEARN_MORE" },
      },
      required: ["account_id", "name", "page_id", "message", "link"],
    },
  },
  {
    name: "create_ad",
    description: "Maak een advertentie aan door adset en creative te koppelen (altijd PAUSED)",
    inputSchema: {
      type: "object",
      properties: {
        adset_id: { type: "string" },
        name: { type: "string" },
        creative_id: { type: "string" },
      },
      required: ["adset_id", "name", "creative_id"],
    },
  },
  {
    name: "update_ad_creative",
    description: "Pas de tekst of link van een bestaande creative aan",
    inputSchema: {
      type: "object",
      properties: {
        creative_id: { type: "string" },
        message: { type: "string" },
        link: { type: "string" },
      },
      required: ["creative_id"],
    },
  },
  {
    name: "list_audiences",
    description: "Toon alle custom audiences in een ad account",
    inputSchema: {
      type: "object",
      properties: { account_id: { type: "string" } },
      required: ["account_id"],
    },
  },
  {
    name: "create_custom_audience",
    description: "Maak een nieuwe custom audience aan",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        subtype: { type: "string", description: "Bijv: CUSTOM, WEBSITE" },
      },
      required: ["account_id", "name", "subtype"],
    },
  },
  {
    name: "add_users_to_audience",
    description: "Voeg telefoonnummers of emails toe aan een custom audience",
    inputSchema: {
      type: "object",
      properties: {
        audience_id: { type: "string" },
        phones: { type: "array", items: { type: "string" }, description: "Lijst van telefoonnummers" },
        emails: { type: "array", items: { type: "string" }, description: "Lijst van e-mailadressen" },
      },
      required: ["audience_id"],
    },
  },
  {
    name: "create_lookalike_audience",
    description: "Maak een lookalike audience gebaseerd op een custom audience",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string" },
        origin_audience_id: { type: "string" },
        country: { type: "string", description: "Landcode, bijv: NL of BE" },
        ratio: { type: "number", description: "Grootte 0.01–0.20 (1%–20% van populatie)" },
      },
      required: ["account_id", "origin_audience_id", "country", "ratio"],
    },
  },
];
