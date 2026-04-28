import { toolDefinitions } from "./tools";
import * as read from "./handlers/read";
import * as write from "./handlers/write";
import * as audiences from "./handlers/audiences";
import { logToolCall } from "../supabase";
import { MetaApiError } from "../meta-ads";

const handlers: Record<string, (args: any) => Promise<any>> = {
  ...read,
  ...write,
  ...audiences,
};

export async function handleRpc(body: any): Promise<any> {
  const { jsonrpc, id, method, params } = body;

  // MCP initialize
  if (method === "initialize") {
    return {
      jsonrpc: "2.0", id,
      result: {
        protocolVersion: params?.protocolVersion ?? "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "ahlamsdesigns-meta-mcp", version: "1.0.0" },
      },
    };
  }

  // List tools
  if (method === "tools/list") {
    return {
      jsonrpc: "2.0", id,
      result: { tools: toolDefinitions },
    };
  }

  // Call tool
  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments ?? {};
    const handler = handlers[toolName];

    if (!handler) {
      return {
        jsonrpc: "2.0", id,
        error: { code: -32601, message: `Tool niet gevonden: ${toolName}` },
      };
    }

    const start = Date.now();
    try {
      const result = await handler(args);
      const duration_ms = Date.now() - start;
      await logToolCall({ tool_name: toolName, arguments: args, result, duration_ms, ad_account_id: args.account_id });
      return {
        jsonrpc: "2.0", id,
        result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] },
      };
    } catch (err: any) {
      const duration_ms = Date.now() - start;
      const errorMsg = err instanceof MetaApiError ? `${err.title}: ${err.userMsg}` : err.message;
      await logToolCall({ tool_name: toolName, arguments: args, error: errorMsg, duration_ms });
      return {
        jsonrpc: "2.0", id,
        result: { content: [{ type: "text", text: `Fout: ${errorMsg}` }], isError: true },
      };
    }
  }

  return {
    jsonrpc: "2.0", id,
    error: { code: -32601, message: `Methode niet gevonden: ${method}` },
  };
}
