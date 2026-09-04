'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type ListFactorsData = NonNullable<Awaited<ReturnType<ReturnType<typeof createClient>['auth']['mfa']['listFactors']>>['data']>;
type Factor = ListFactorsData['all'][number];

export function MfaSettings() {
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [qrDataUri, setQrDataUri] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.mfa.listFactors();
      setFactors((data?.all ?? []).filter((f): f is Factor => f.factor_type === 'totp'));
    } catch {
      setFactors([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startEnroll = async () => {
    setError('');
    setBusy(true);
    try {
      const supabase = createClient();
      // Clear any abandoned unverified enrollment before starting a fresh one --
      // Supabase does not auto-expire these, and a stale one would otherwise block re-enrolling.
      const { data: existing } = await supabase.auth.mfa.listFactors();
      const stale = existing?.all?.find((f) => f.factor_type === 'totp' && f.status === 'unverified');
      if (stale) await supabase.auth.mfa.unenroll({ factorId: stale.id });

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (enrollError) throw enrollError;
      setFactorId(data.id);
      setSecret(data.totp.secret);
      // Despite its own doc comment suggesting a prefix is needed, the installed SDK's own
      // usage example passes qr_code directly as an <img src> -- it's already a complete data
      // URI in this version. Only add the prefix ourselves if it genuinely isn't one, so this
      // stays correct even if a different Supabase project/version returns raw SVG instead.
      const rawQr = data.totp.qr_code;
      setQrDataUri(rawQr.startsWith('data:') ? rawQr : `data:image/svg+xml;utf-8,${encodeURIComponent(rawQr)}`);
      setEnrolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start setup. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw new Error('Incorrect code. Check your authenticator app and try again.');
      setEnrolling(false);
      setCode('');
      setSecret('');
      setQrDataUri('');
      setFactorId('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Turn off two-factor authentication? You will only need your password to sign in.')) return;
    setBusy(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (unenrollError) throw unenrollError;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not turn off two-factor authentication. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const cancelEnroll = async () => {
    setBusy(true);
    try {
      const supabase = createClient();
      if (factorId) await supabase.auth.mfa.unenroll({ factorId });
    } catch {
      // Best-effort cleanup; a leftover unverified factor is cleared on the next enroll attempt.
    }
    setEnrolling(false);
    setCode('');
    setSecret('');
    setQrDataUri('');
    setFactorId('');
    setError('');
    setBusy(false);
  };

  if (factors === null) {
    return <p className="text-xs text-muted-foreground">Loading two-factor status…</p>;
  }

  const verified = factors.find((f) => f.status === 'verified');

  if (verified) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Two-factor authentication is on</p>
          <p className="text-xs text-muted-foreground">You&apos;ll need a code from your authenticator app to sign in.</p>
        </div>
        <button
          type="button"
          onClick={() => remove(verified.id)}
          disabled={busy}
          className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Turn off
        </button>
      </div>
    );
  }

  if (enrolling) {
    return (
      <form onSubmit={verify} className="space-y-3 rounded-lg border p-3">
        <p className="text-sm font-medium">Scan this with Google Authenticator (or any TOTP app)</p>
        {qrDataUri && (
          <img
            src={qrDataUri}
            alt="Two-factor authentication setup QR code"
            className="h-40 w-40 rounded-lg border bg-white p-2"
          />
        )}
        {secret && (
          <p className="text-xs text-muted-foreground">
            Can&apos;t scan? Enter this key manually: <code className="rounded bg-muted px-1 py-0.5">{secret}</code>
          </p>
        )}
        <label className="block text-sm font-medium">
          6-digit code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-center tracking-[0.3em] outline-none focus:ring-2 focus:ring-ring"
            maxLength={6}
            required
          />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="h-9 rounded-lg bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-50"
          >
            {busy ? 'Verifying…' : 'Verify & enable'}
          </button>
          <button type="button" onClick={cancelEnroll} disabled={busy} className="h-9 rounded-lg border px-4 text-sm font-medium">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Two-factor authentication is off</p>
          <p className="text-xs text-muted-foreground">Add an extra step at sign-in using Google Authenticator or a similar app.</p>
        </div>
        <button
          type="button"
          onClick={startEnroll}
          disabled={busy}
          className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background disabled:opacity-50"
        >
          {busy ? 'Starting…' : 'Enable'}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
