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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!tokenOk(params.token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }
  try {
    const body = await req.json();
    const result = await handleRpc(body);
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!tokenOk(params.token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/event-stream")) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const data = JSON.stringify({
          jsonrpc: "2.0",
          method: "notifications/initialized",
          params: {},
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      },
    });
    return new NextResponse(stream, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
  return NextResponse.json(
    { status: "ok", server: "ahlamsdesigns-meta-mcp", version: "1.0.0" },
    { headers: CORS_HEADERS }
  );
}
