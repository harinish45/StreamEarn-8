'use client';

import { useEffect, useState } from 'react';
import { Download, HardDrive, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localGet, localSet, clearLocalStore } from '@/lib/local-store';

const keys = ['workspace.tasks', 'browser.sessions', 'browser.history', 'preferences', 'favorites', 'resource.bookmarks'];

export function StorageManager() {
  const [persistent, setPersistent] = useState(false);
  const [supported, setSupported] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    setSupported('storage' in navigator && 'persist' in navigator.storage);
    navigator.storage?.persisted?.().then(setPersistent).catch(() => {});
  }, []);

  const requestPersistence = async () => {
    if (!navigator.storage?.persist) return;
    const granted = await navigator.storage.persist();
    setPersistent(granted);
    setMessage(granted ? 'Persistent storage enabled.' : 'The browser did not grant persistent storage.');
  };

  const exportData = async () => {
    const data: Record<string, unknown> = {};
    for (const key of keys) data[key] = await localGet(key, null);
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'streamearn-local-backup.json'; a.click(); URL.revokeObjectURL(url);
    setMessage('Local backup exported.');
  };

  const importData = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        for (const key of keys) if (key in (parsed.data ?? {})) await localSet(key, parsed.data[key]);
        setMessage('Backup restored. Reload the page to refresh data.');
      } catch { setMessage('Invalid StreamEarn backup file.'); }
    };
    input.click();
  };

  const clear = async () => {
    if (!window.confirm('Clear all StreamEarn local data on this device? This cannot be undone unless you exported a backup.')) return;
    await clearLocalStore(); setMessage('Local StreamEarn data cleared.');
  };

  return <section className="rounded-2xl border bg-card p-5">
    <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><HardDrive className="h-5 w-5" /></div><div><h2 className="font-semibold">Local storage</h2><p className="text-sm text-muted-foreground">Your workspace data stays in this browser. IndexedDB is used first; localStorage is only a fallback.</p></div></div>
    <div className="mt-4 flex flex-wrap gap-2">
      {supported && <Button variant="outline" onClick={requestPersistence}><ShieldCheck className="mr-2 h-4 w-4" />{persistent ? 'Persistent storage enabled' : 'Protect local storage'}</Button>}
      <Button variant="outline" onClick={exportData}><Download className="mr-2 h-4 w-4" />Export backup</Button>
      <Button variant="outline" onClick={importData}><Upload className="mr-2 h-4 w-4" />Import backup</Button>
      <Button variant="destructive" onClick={clear}><Trash2 className="mr-2 h-4 w-4" />Clear local data</Button>
    </div>
    {message && <p className="mt-3 text-xs text-muted-foreground">{message}</p>}
  </section>;
}
