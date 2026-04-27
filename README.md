# Ahlamsdesigns Meta Ads MCP Server

Een MCP (Model Context Protocol) server die Claude verbindt met je Meta Ads account.

## Wat doet dit?

Met deze server kan Claude direct:
- Je Facebook/Instagram campagnes bekijken en analyseren
- Nieuwe campagnes aanmaken
- Budgetten aanpassen
- Advertenties aan/uitzetten
- Prestaties analyseren

## Deploy stappen

### 1. GitHub
- Push deze code naar een nieuwe GitHub repository

### 2. Vercel
- Ga naar vercel.com → New Project → importeer je GitHub repo
- Voeg de volgende Environment Variables toe:

| Variable | Waarde |
|----------|--------|
| MCP_BEARER_TOKEN | Genereer op: passwordsgenerator.net (48+ tekens) |
| META_ACCESS_TOKEN | Zie stap 3 hieronder |
| META_API_VERSION | v22.0 |
| NEXT_PUBLIC_SUPABASE_URL | https://bbmonujiyvznqwvbvqpp.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Je Supabase service role key |

### 3. Meta Access Token ophalen
1. Ga naar developers.facebook.com
2. Maak een nieuwe App aan (type: Business)
3. Voeg "Marketing API" toe als product
4. Ga naar Tools → Graph API Explorer
5. Selecteer je app en kies permissions: ads_management, ads_read, pages_read_engagement
6. Klik "Generate Access Token"
7. Gebruik de Token Debugger om een langlevend token te genereren

### 4. Claude Custom Connector
1. Ga naar claude.ai → Settings → Connectors
2. Klik "Add Custom Connector"
3. Vul in:
   - URL: https://JOUW-VERCEL-URL/api/mcp/JOUW-MCP-BEARER-TOKEN
4. Klik Save

## Gebruik

Na het koppelen kun je Claude vragen:
- "Laat mijn campagnes zien"
- "Analyseer de prestaties van de afgelopen 30 dagen"
- "Maak een nieuwe campagne aan voor welkomstspiegels"
- "Zet de slecht presterende advertenties uit"
