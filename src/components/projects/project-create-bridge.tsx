'use client';

import { useEffect } from 'react';

const fields = ['name', 'organization', 'role', 'nextAction', 'repository', 'liveUrl', 'people', 'techStack', 'description', 'notes', 'status', 'priority', 'progress'];

export default function ProjectCreateBridge() {
  useEffect(() => {
    const onSubmit = async (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || !form.querySelector('input[required]')) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'));
      const values: Record<string, string> = {};
      controls.forEach((control, index) => {
        const key = control.name || fields[index];
        if (key) values[key] = control.value;
      });

      const name = (values.name || '').trim();
      if (!name) {
        form.querySelector<HTMLInputElement>('input[required]')?.focus();
        return;
      }

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const original = button?.textContent || 'Create Project';
      button?.setAttribute('disabled', 'true');
      button?.setAttribute('aria-busy', 'true');
      if (button) button.textContent = 'Creating…';

      const payload = {
        ...values,
        name,
        progress: Math.min(100, Math.max(0, Number(values.progress) || 0)),
        people: (values.people || '').split(',').map((x) => x.trim()).filter(Boolean),
        techStack: (values.techStack || '').split(',').map((x) => x.trim()).filter(Boolean),
        notes: (values.notes || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean),
      };

      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store',
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || `Project creation failed (${response.status})`);
        window.location.replace('/projects?created=1');
      } catch (error) {
        if (button) {
          button.removeAttribute('disabled');
          button.removeAttribute('aria-busy');
          button.textContent = original;
        }
        window.alert(error instanceof Error ? error.message : 'Project could not be created.');
      }
    };

    document.addEventListener('submit', onSubmit, true);
    return () => document.removeEventListener('submit', onSubmit, true);
  }, []);

  return null;
}
