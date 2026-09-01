import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Profile | StreamEarn' };

export default function ProfilePage() {
  return <>
    <Header />
    <main className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <Card className="themed-card">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border bg-background/40 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div><div className="mt-1 text-base font-medium">harinish@proton.me</div></div>
          <div className="rounded-xl border bg-background/40 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Account status</div><div className="mt-1 flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-emerald-400" />Online</div></div>
        </CardContent>
      </Card>
    </main>
  </>;
}
