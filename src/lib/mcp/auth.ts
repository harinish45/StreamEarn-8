import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const TOKEN_PREFIX = 'se_mcp_';

export function generateToken() {
  return TOKEN_PREFIX + crypto.randomBytes(32).toString('base64url');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

/** Resolves a bearer token to the owning user's id, or null if invalid/unknown. Never throws. */
export async function resolveOwnerFromToken(token: string): Promise<string | null> {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  try {
    const sb = createSupabaseAdminClient();
    const hash = hashToken(token);
    const { data, error } = await sb.from('api_tokens').select('id,owner_id').eq('token_hash', hash).maybeSingle();
    if (error || !data) return null;
    // Best-effort, never blocks the request on failure.
    sb.from('api_tokens').update({ last_used_at: new Date().toISOString() }).eq('id', data.id).then(
      () => {},
      () => {},
    );
    return data.owner_id as string;
  } catch {
    return null;
  }
}
