import Link from 'next/link';
import { Bell, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Notifications | StreamEarn' };

export default async function NotificationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-3xl p-4 md:p-6">
          <Card className="themed-card">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Bell className="h-10 w-10 text-muted-foreground" />
              <h1 className="text-xl font-semibold">Sign in to view notifications</h1>
              <Link href="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Sign in</Link>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg border p-2 hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">Updates and account activity</p>
          </div>
        </div>

        <Card className="themed-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Recent notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center">
              <CheckCircle2 className="mb-3 h-9 w-9 text-emerald-400" />
              <p className="font-medium">You’re all caught up</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">There are no new notifications for your account right now.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
