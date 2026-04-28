import { NextRequest, NextResponse } from "next/server";
import { handleRpc } from "../../../../lib/mcp/rpc-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

function tokenOk(token: string): boolean {
  const expected = process.env.MCP_BEARER_TOKEN;
  if (!expected || token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  return NextResponse.json(response, {
    headers: {
      ...CORS,
      "Mcp-Session-Id": crypto.randomUUID(),
    },
  });
}
