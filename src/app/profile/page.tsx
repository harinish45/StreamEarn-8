import Link from 'next/link';
import { ArrowLeft, CircleUserRound, Mail, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Profile | StreamEarn' };

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-4xl p-4 md:p-6">
          <Card className="themed-card">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <CircleUserRound className="h-10 w-10 text-muted-foreground" />
              <h1 className="text-xl font-semibold">Sign in to view your profile</h1>
              <Link href="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Sign in</Link>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const email = user.email ?? 'No email available';
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
  const createdAt = user.created_at ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(user.created_at)) : '—';

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg border p-2 hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage and view your StreamEarn account</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <Card className="themed-card">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-muted text-2xl font-semibold uppercase">
                {displayName.slice(0, 1)}
              </div>
              <div className="font-semibold">{displayName}</div>
              <div className="text-xs text-muted-foreground">Personal account</div>
            </CardContent>
          </Card>

          <Card className="themed-card">
            <CardHeader><CardTitle>Account details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border bg-background/40 p-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div><div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div><div className="mt-1 break-all text-sm font-medium">{email}</div></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border bg-background/40 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div><div className="text-xs uppercase tracking-widest text-muted-foreground">Authentication</div><div className="mt-1 text-sm font-medium">Supabase Auth</div></div>
              </div>
              <div className="rounded-xl border bg-background/40 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Account created</div>
                <div className="mt-1 text-sm font-medium">{createdAt}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
