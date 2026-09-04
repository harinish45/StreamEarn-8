'use client';

import { useEffect } from 'react';

function showMembers(names: string[]) {
  document.getElementById('project-members-popover')?.remove();
  const box = document.createElement('div');
  box.id = 'project-members-popover';
  box.style.cssText = 'position:fixed;z-index:9999;right:24px;bottom:24px;width:min(360px,calc(100vw - 32px));padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#161412;color:#f5f0e8;box-shadow:0 20px 60px rgba(0,0,0,.55);font:13px system-ui,sans-serif';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px';
  const title = document.createElement('strong');
  title.textContent = 'Members';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.id = 'project-members-close';
  closeBtn.style.cssText = 'border:0;background:transparent;color:#8a8478;font-size:20px;cursor:pointer';
  closeBtn.textContent = '×';
  header.append(title, closeBtn);

  const list = document.createElement('div');
  list.style.cssText = 'margin-top:12px;color:#8a8478;line-height:1.7';
  if (names.length) {
    for (const n of names) {
      const row = document.createElement('div');
      row.textContent = `• ${String(n)}`;
      list.appendChild(row);
    }
  } else {
    list.textContent = 'No members recorded for this project.';
  }

  box.append(header, list);
  document.body.appendChild(box);
  closeBtn.addEventListener('click', () => box.remove(), { once: true });
}

export default function ProjectInteractionBridge() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const saveIdea = target.closest('button');
      if (saveIdea?.textContent?.trim() === 'Save Idea') {
        const form = saveIdea.closest('form') as HTMLFormElement | null;
        if (!form) return;
        const input = form.querySelector<HTMLInputElement>('input');
        const textarea = form.querySelector<HTMLTextAreaElement>('textarea');
        const name = input?.value.trim() || '';
        if (!name) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (input) input.name = 'name';
        if (textarea) textarea.name = 'description';
        form.method = 'POST';
        form.action = '/api/project-ideas';
        form.target = '_self';
        form.submit();
        return;
      }

      const memberTarget = target.closest('span');
      if (memberTarget && /\bmembers?$/i.test(memberTarget.textContent?.trim() || '')) {
        const card = memberTarget.closest('button');
        if (!card) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const title = card.querySelector('h3')?.textContent?.trim();
        if (!title) return;
        try {
          const response = await fetch('/api/projects', { credentials: 'same-origin', cache: 'no-store' });
          if (!response.ok) throw new Error('Unable to load members');
          const data = await response.json();
          const project = Array.isArray(data) ? data.find((p: any) => p.name === title) : null;
          showMembers(Array.isArray(project?.people) ? project.people : []);
        } catch {
          showMembers([]);
        }
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
