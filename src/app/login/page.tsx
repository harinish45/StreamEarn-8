'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function safeNextPath(value: string | null): string {
  // Only allow a same-origin relative path so this can never become an open redirect.
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  return value;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        // Keep the UI useful without exposing tokens, database details, or raw server errors.
        const message = signInError.message.toLowerCase();
        if (message.includes('invalid login credentials')) {
          throw new Error('Email or password is incorrect. Check both and try again.');
        }
        if (message.includes('email not confirmed')) {
          throw new Error('Please confirm your email address before signing in.');
        }
        if (message.includes('too many requests')) {
          throw new Error('Too many sign-in attempts. Please wait a moment and try again.');
        }
        throw new Error('Sign-in is currently unavailable. Please try again.');
      }

      router.replace(safeNextPath(searchParams.get('next')));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm" noValidate>
        <h1 className="text-2xl font-semibold tracking-tight">StreamEarn</h1>
        <p className="mt-1 text-sm text-muted-foreground">Secure sign in</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              required
              maxLength={320}
              autoCapitalize="none"
              spellCheck={false}
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              required
              maxLength={256}
            />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="h-10 w-full rounded-lg bg-foreground text-sm font-semibold text-background disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </main>
  );
}
