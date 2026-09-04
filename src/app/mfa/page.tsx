'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function safeNextPath(value: string | null): string {
  // Only allow a same-origin relative path so this can never become an open redirect.
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  return value;
}

export default function MfaPage() {
  return (
    <Suspense fallback={null}>
      <MfaChallenge />
    </Suspense>
  );
}

function MfaChallenge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: listError } = await supabase.auth.mfa.listFactors();
        if (listError) throw listError;
        const verified = data?.all?.find((f) => f.factor_type === 'totp' && f.status === 'verified');
        if (cancelled) return;
        if (!verified) {
          // Nothing to challenge -- send the user on rather than stranding them here.
          router.replace(safeNextPath(searchParams.get('next')));
          return;
        }
        setFactorId(verified.id);
        setReady(true);
      } catch {
        if (!cancelled) {
          setError('Unable to load two-factor status. Please try signing in again.');
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw new Error('Incorrect code. Please try again.');
      router.replace(safeNextPath(searchParams.get('next')));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore -- the destination login page still gates access on a valid session.
    }
    router.replace('/login');
    router.refresh();
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm" noValidate>
        <h1 className="text-2xl font-semibold tracking-tight">Two-factor verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-ring"
              maxLength={6}
              autoFocus
              required
              disabled={!factorId}
            />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button
            disabled={loading || code.length !== 6 || !factorId}
            className="h-10 w-full rounded-lg bg-foreground text-sm font-semibold text-background disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button type="button" onClick={signOut} className="h-9 w-full rounded-lg border text-sm font-medium">
            Sign in with a different account
          </button>
        </div>
      </form>
    </main>
  );
}
