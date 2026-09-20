'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Github, Link2, RefreshCw, Unplug, XCircle } from 'lucide-react';

type Provider = 'google' | 'github';
type Integration = {
  provider: Provider;
  name: string;
  description: string;
  capabilities: string[];
  configured: boolean;
  account: {
    id: string | null;
    email: string | null;
    name: string | null;
    scopes: string[];
    lastSyncedAt: string | null;
    connectedAt: string;
    updatedAt: string;
  } | null;
};

async function jsonFetch(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store', credentials: 'same-origin' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload;
}

const fmt = (value: string | null) => value ? new Date(value).toLocaleString() : 'Never';

function providerIcon(provider: Provider) {
  return provider === 'google' ? <CalendarDays className="h-5 w-5" /> : <Github className="h-5 w-5" />;
}

export function IntegrationsSettings() {
  const [items, setItems] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Provider | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState<Record<Provider, string>>({ google: '', github: '' });

  const load = async () => {
    try {
      setError('');
      setItems(await jsonFetch('/api/integrations'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load integrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('integration');
    const status = params.get('status');
    if (provider && status === 'connected') setMessage(`${provider === 'google' ? 'Google Calendar' : 'GitHub'} connected successfully.`);
    else if (provider && status === 'not-configured') setError(`${provider === 'google' ? 'Google Calendar' : 'GitHub'} OAuth is not configured on the server yet.`);
    else if (provider && status === 'error') setError(`${provider === 'google' ? 'Google Calendar' : 'GitHub'} connection could not be completed.`);
    if (provider || status) window.history.replaceState({}, '', '/settings');
  }, []);

  const disconnect = async (provider: Provider) => {
    if (!window.confirm('Disconnect this integration? Its stored OAuth tokens will be removed from StreamEarn.')) return;
    setBusy(provider);
    setError('');
    setMessage('');
    try {
      await jsonFetch(`/api/integrations/${provider}`, { method: 'DELETE' });
      setTestResult((current) => ({ ...current, [provider]: '' }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disconnect integration.');
    } finally {
      setBusy(null);
    }
  };

  const test = async (provider: Provider) => {
    setBusy(provider);
    setError('');
    setMessage('');
    try {
      const result = await jsonFetch(`/api/integrations/${provider}/test`, { method: 'POST' });
      const summary = result?.summary || {};
      const detail = provider === 'google'
        ? `Verified. Upcoming events returned: ${Array.isArray(summary.upcomingEvents) ? summary.upcomingEvents.length : 0}.`
        : `Verified as @${summary.login || 'GitHub user'}.`;
      setTestResult((current) => ({ ...current, [provider]: detail }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Integration test failed.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-background/40 p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
          <Link2 className="h-4 w-4" /> Real integrations
        </div>
        <p className="text-xs text-muted-foreground">
          These are real OAuth connections. StreamEarn stores encrypted provider tokens server-side and never exposes them to the browser.
        </p>
      </div>

      {message && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">{message}</div>}
      {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading integrations…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => {
            const connected = Boolean(item.account);
            const provider = item.provider;
            return (
              <div key={provider} className="rounded-xl border bg-background/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-muted/40">{providerIcon(provider)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      {connected ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {item.capabilities.map((capability) => <div key={capability}>• {capability}</div>)}
                </div>

                {connected && item.account ? (
                  <div className="mt-4 rounded-lg border bg-muted/20 p-3 text-xs">
                    <div className="font-medium">{item.account.name || item.account.email || 'Connected account'}</div>
                    {item.account.email && <div className="mt-0.5 text-muted-foreground">{item.account.email}</div>}
                    <div className="mt-2 text-muted-foreground">Last verified: {fmt(item.account.lastSyncedAt)}</div>
                    {testResult[provider] && <div className="mt-2 text-emerald-700 dark:text-emerald-300">{testResult[provider]}</div>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => test(provider)}
                        disabled={busy === provider}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${busy === provider ? 'animate-spin' : ''}`} /> Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => disconnect(provider)}
                        disabled={busy === provider}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        <Unplug className="h-3.5 w-3.5" /> Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className={`text-xs ${item.configured ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-300'}`}>
                      {item.configured ? 'Ready to connect' : 'Server OAuth credentials not configured'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { window.location.href = `/api/integrations/${provider}/start`; }}
                      disabled={!item.configured || busy === provider}
                      className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Connect
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
