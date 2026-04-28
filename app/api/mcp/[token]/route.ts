import { NextRequest, NextResponse } from "next/server";
import { handleRpc } from "../../../../lib/mcp/rpc-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

function tokenOk(token: string): boolean {
    const expected = process.env.MCP_BEARER_TOKEN;
    if (!expected) return false;
    return token === expected;
}

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Mcp-Session-Id",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
    req: NextRequest,
  { params }: { params: { token: string } }
  ) {
    if (!tokenOk(params.token)) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }
    return NextResponse.json(
      { status: "ok", server: "ahlamsdesigns-meta-mcp", version: "1.0.0" },
      { headers: CORS }
        );
}

export async function POST(
    req: NextRequest,
  { params }: { params: { token: string } }
  ) {
    if (!tokenOk(params.token)) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }

  let body: any;
    try {
          body = await req.json();
    } catch {
          return NextResponse.json(
            { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
            { status: 400, headers: CORS }
                );
    }

  const requests = Array.isArray(body) ? body : [body];
    const results = await Promise.all(requests.map(handleRpc));
    const response = Array.isArray(body) ? results : results[0];

  return NextResponse.json(response, { headers: CORS });
}
