'use client';

import { useEffect } from 'react';

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

      const payload = new FormData(form);
      const nameInput = form.querySelector<HTMLInputElement>('input[required]');
      const name = String(payload.get('name') || nameInput?.value || '').trim();
      if (!name) {
        nameInput?.focus();
        return;
      }
      payload.set('name', name);

      button.setAttribute('aria-busy', 'true');
      button.setAttribute('disabled', 'true');
      const original = button.textContent || 'Create Project';
      button.textContent = 'Creating…';

      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
          body: payload,
          cache: 'no-store',
        });
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok) {
          const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
          throw new Error(data?.error || `Project creation failed (${response.status})`);
        }
        window.location.assign('/projects?created=1');
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
