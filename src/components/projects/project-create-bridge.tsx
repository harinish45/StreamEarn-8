'use client';

import { useEffect } from 'react';

/**
 * Production fallback for the project modal. It deliberately listens at the
 * document level so a stale/hydrated modal handler cannot swallow the create
 * action. The server route accepts native FormData and redirects back to the
 * command center after persistence.
 */
export default function ProjectCreateBridge() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.textContent?.trim() !== 'Create Project') return;
      const form = button.closest('form') as HTMLFormElement | null;
      if (!form) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const name = String(new FormData(form).get('name') || '').trim();
      if (!name) {
        const input = form.querySelector<HTMLInputElement>('input[required]');
        input?.focus();
        return;
      }

      button.setAttribute('aria-busy', 'true');
      button.setAttribute('disabled', 'true');
      const original = button.textContent || 'Create Project';
      button.textContent = 'Creating…';

      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
          cache: 'no-store',
        });
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok) {
          const payload = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
          throw new Error(payload?.error || `Project creation failed (${response.status})`);
        }
        if (contentType.includes('application/json')) {
          // The modal's normal state handler is bypassed intentionally. Reload
          // guarantees the authoritative DB-backed list is rendered.
          window.location.assign('/projects?created=1');
        } else {
          window.location.assign('/projects?created=1');
        }
      } catch (error) {
        button.removeAttribute('disabled');
        button.removeAttribute('aria-busy');
        button.textContent = original;
        window.alert(error instanceof Error ? error.message : 'Project could not be created.');
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
