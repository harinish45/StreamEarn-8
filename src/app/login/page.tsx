'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (!res.ok) throw new Error('Invalid username or password');
      router.replace('/'); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed'); setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4"><form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-semibold tracking-tight">StreamEarn</h1><p className="mt-1 text-sm text-muted-foreground">Secure sign in</p><div className="mt-6 space-y-4"><label className="block text-sm font-medium">Username<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" required maxLength={100}/></label><label className="block text-sm font-medium">Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" required maxLength={256}/></label>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="h-10 w-full rounded-lg bg-foreground text-sm font-semibold text-background disabled:opacity-50">{loading?'Signing in…':'Sign in'}</button></div></form></main>;
}
