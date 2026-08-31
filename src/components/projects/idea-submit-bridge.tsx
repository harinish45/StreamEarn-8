'use client';

import { useEffect } from 'react';

export default function IdeaSubmitBridge() {
  useEffect(() => {
    const submit = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.textContent?.trim() !== 'Save Idea') return;
      const source = button.closest('form') as HTMLFormElement | null;
      if (!source) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const fields = source.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
      const nameField = Array.from(fields).find((field) => field instanceof HTMLInputElement);
      const descriptionField = Array.from(fields).find((field) => field instanceof HTMLTextAreaElement);
      const name = nameField?.value.trim() || '';
      const description = descriptionField?.value.trim() || '';
      if (!name) {
        nameField?.focus();
        return;
      }

      const form = document.createElement('form');
      form.method = 'post';
      form.action = '/api/project-ideas';
      form.style.display = 'none';
      for (const [key, value] of [['name', name], ['description', description]]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    };

    document.addEventListener('click', submit, true);
    return () => document.removeEventListener('click', submit, true);
  }, []);

  return null;
}
