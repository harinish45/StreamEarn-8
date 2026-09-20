import crypto from 'node:crypto';

export type IntegrationProvider = 'google' | 'github';

export const INTEGRATION_PROVIDERS: Record<IntegrationProvider, {
  name: string;
  description: string;
  capabilities: string[];
}> = {
  google: {
    name: 'Google Calendar',
    description: 'Connect your Google Calendar to read upcoming events from StreamEarn.',
    capabilities: ['Read upcoming calendar events', 'Show account identity', 'Refresh OAuth access automatically'],
  },
  github: {
    name: 'GitHub',
    description: 'Connect GitHub to verify your account and power future repository-aware workflows.',
    capabilities: ['Read your GitHub identity', 'Read verified email addresses', 'Keep an OAuth connection for future project workflows'],
  },
};

const COOKIE_PREFIX = 'streamearn-oauth-state-';

export function isIntegrationProvider(value: string): value is IntegrationProvider {
  return value === 'google' || value === 'github';
}

export function stateCookieName(provider: IntegrationProvider) {
  return COOKIE_PREFIX + provider;
}

export function integrationConfig(provider: IntegrationProvider) {
  if (provider === 'google') {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() || '';
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() || '';
    return { clientId, clientSecret };
  }
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim() || '';
  return { clientId, clientSecret };
}

export function redirectUri(request: Request, provider: IntegrationProvider) {
  const url = new URL(request.url);
  return new URL(`/api/integrations/${provider}/callback`, `${url.protocol}//${url.host}`).toString();
}

function encryptionKey() {
  const secret = process.env.STREAMEARN_INTEGRATION_ENCRYPTION_KEY?.trim();
  if (!secret) throw new Error('STREAMEARN_INTEGRATION_ENCRYPTION_KEY is not configured');
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSecret(value: string | null | undefined) {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString('base64url')).join('.');
}

export function decryptSecret(value: string | null | undefined) {
  if (!value) return '';
  const [ivRaw, tagRaw, ciphertextRaw] = value.split('.');
  if (!ivRaw || !tagRaw || !ciphertextRaw) throw new Error('Malformed encrypted integration secret');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    encryptionKey(),
    Buffer.from(ivRaw, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextRaw, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export function randomState() {
  return crypto.randomBytes(32).toString('base64url');
}

export async function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
