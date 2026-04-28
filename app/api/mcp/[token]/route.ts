import { NextRequest, NextResponse } from "next/server";
import { handleRpc } from "../../../../lib/mcp/rpc-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  return NextResponse.json({ status: "ok" }, { headers: CORS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400, headers: CORS });
  const requests = Array.isArray(body) ? body : [body];
  const results = await Promise.all(requests.map(handleRpc));
  return NextResponse.json(Array.isArray(body) ? results : results[0], { headers: CORS });
}
