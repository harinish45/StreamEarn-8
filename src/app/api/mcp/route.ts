import { NextRequest, NextResponse } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { resolveOwnerFromToken } from '@/lib/mcp/auth';
import { buildMcpServer } from '@/lib/mcp/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rpcError = (status: number, message: string) =>
  NextResponse.json({ jsonrpc: '2.0', error: { code: -32000, message }, id: null }, { status, headers: { 'Cache-Control': 'no-store', 'WWW-Authenticate': 'Bearer' } });

function bearerToken(request: NextRequest) {
  const header = request.headers.get('authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : '';
}

// Stateless mode only (sessionIdGenerator: undefined) -- each request builds a fresh
// server + transport, matching the SDK's own reference implementation for this
// pattern (examples/server/simpleStatelessStreamableHttp.ts). GET/DELETE (SSE
// streaming, session termination) aren't meaningful without server-side session
// state, so they're rejected the same way the reference example rejects them.
export async function POST(request: NextRequest) {
  const token = bearerToken(request);
  if (!token) return rpcError(401, 'Missing bearer token. Generate one from Settings → API access.');
  const ownerId = await resolveOwnerFromToken(token);
  if (!ownerId) return rpcError(401, 'Invalid or revoked token.');

  const server = buildMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request, { authInfo: { token, clientId: ownerId, scopes: [], extra: { ownerId } } });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('[mcp] request failed', error);
    return rpcError(500, 'Internal server error');
  } finally {
    await transport.close().catch(() => {});
    await server.close().catch(() => {});
  }
}

export async function GET() {
  return rpcError(405, 'This MCP endpoint is stateless and does not support GET/SSE streaming.');
}

export async function DELETE() {
  return rpcError(405, 'This MCP endpoint is stateless and has no session to terminate.');
}
