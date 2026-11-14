import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createEventFromInput } from "@/lib/actions/events";
import { eventInputShape } from "@/lib/services/event-input";

/**
 * VAPA MCP server (Streamable HTTP, stateless), served at /api/mcp.
 * Tools only adapt MCP ⇄ admin actions: the work and the admin check live in the actions.
 * The MCP client sends an admin's better-auth session cookie, read like any admin panel request.
 */
function buildServer() {
  const server = new McpServer({ name: "vapa", version: "1.0.0" });

  server.registerTool(
    "create_event",
    {
      description:
        "Create a VAPA event (webinar or special event). Pass an `image` (e.g. a flyer) to have its details " +
        "extracted automatically, an `event` JSON object, or both — `event` fields override what is read from " +
        "the image. Text may be in Spanish or English: give just one language and the other is translated " +
        "automatically. The image becomes the event image unless `event.img` is set. Use dry_run to preview.",
      inputSchema: eventInputShape,
    },
    async (input) => {
      const result = await createEventFromInput(input);
      if (!result.success) {
        return { isError: true, content: [{ type: "text", text: result.error.message }] };
      }
      const { id, event } = result.data;
      const heading = id ? `Created event ${id}` : "Preview (not saved)";
      return { content: [{ type: "text", text: `${heading}\n${JSON.stringify(event, null, 2)}` }] };
    }
  );

  return server;
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  // ponytail: stateless — fresh server per request; add sessions only if a tool needs server→client streaming.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await buildServer().connect(transport);
  return transport.handleRequest(request);
}
