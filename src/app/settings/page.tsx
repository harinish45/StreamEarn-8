import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeSettings } from '@/components/theme-settings';
import { MfaSettings } from '@/components/mfa-settings';

export const metadata = { title: 'Settings | StreamEarn' };

export default function SettingsPage() {
  return <>
    <Header />
    <main className="mx-auto w-full max-w-4xl space-y-4 p-4 md:p-6">
      <Card className="themed-card">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-background/40 p-4">
            <div className="mb-2 text-sm font-semibold">Appearance</div>
            <p className="mb-4 text-xs text-muted-foreground">Choose an interactive StreamEarn theme.</p>
            <ThemeSettings />
          </div>
        </CardContent>
      </Card>
      <Card className="themed-card">
        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-background/40 p-4">
            <div className="mb-2 text-sm font-semibold">Two-factor authentication</div>
            <p className="mb-4 text-xs text-muted-foreground">Optional -- once enabled, sign-in requires both your password and a code from your authenticator app.</p>
            <MfaSettings />
          </div>
        </CardContent>
      </Card>
    </main>
  </>;
}
