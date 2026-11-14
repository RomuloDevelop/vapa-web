/**
 * Where the MCP App (image picker, running inside an AI chat) reports what happens in the chat,
 * so it shows in the server logs. The chat can hide the app's own errors from us.
 */
export async function POST(request: Request) {
  const body = (await request.text()).slice(0, 1000);
  console.error("[mcp-app]", body);
  return new Response(null, { status: 204 });
}
