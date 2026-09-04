'use client';

import { FormEvent, useEffect, useState } from 'react';

type Token = { id: string; label: string; created_at: string; last_used_at: string | null };

async function jsonFetch(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, cache: 'no-store', credentials: 'same-origin' });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d?.error || `Request failed (${r.status})`);
  return d;
}

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : 'Never');

export function ApiTokensSettings() {
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [justCreated, setJustCreated] = useState<{ label: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = async () => {
    try {
      setTokens(await jsonFetch('/api/tokens'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tokens.');
      setTokens([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const data = await jsonFetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.trim() || 'MCP token' }),
      });
      setJustCreated({ label: data.label, token: data.token });
      setLabel('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create token.');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    if (!window.confirm('Revoke this token? Anything using it will stop working immediately.')) return;
    setBusy(true);
    setError('');
    try {
      await jsonFetch(`/api/tokens/${id}`, { method: 'DELETE' });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to revoke token.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!justCreated) return;
    try {
      await navigator.clipboard.writeText(justCreated.token);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Personal access tokens let external tools (like an MCP client) connect to your StreamEarn Projects and directory
        data at <code className="rounded bg-muted px-1 py-0.5">/api/mcp</code> from anywhere -- no cookies or browser
        session needed. Treat a token like a password.
      </p>

      {justCreated && (
        <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/[.04] p-3">
          <p className="text-sm font-medium">Token created: {justCreated.label}</p>
          <p className="text-xs text-muted-foreground">Copy it now -- you will not be able to see it again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg border bg-background px-3 py-2 text-xs">{justCreated.token}</code>
            <button type="button" onClick={copy} className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <button type="button" onClick={() => setJustCreated(null)} className="text-xs text-muted-foreground underline">
            Done, hide this
          </button>
        </div>
      )}

      <form onSubmit={create} className="flex items-end gap-2">
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Label</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Claude Desktop"
            maxLength={120}
            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <button disabled={busy} className="h-9 shrink-0 rounded-lg bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-50">
          {busy ? 'Working…' : 'Generate token'}
        </button>
      </form>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {tokens === null ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : tokens.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tokens yet.</p>
      ) : (
        <div className="space-y-2">
          {tokens.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">Created {fmt(t.created_at)} · Last used {fmt(t.last_used_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => revoke(t.id)}
                disabled={busy}
                className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
