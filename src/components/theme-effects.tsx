'use client';

import { useEffect, useState } from 'react';

export function ThemeEffects() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const read = () => {
      const match = document.body.className.match(/(?:^|\s)(matrix|batman|spider-man|iron-man|superman|hulk)(?:\s|$)/);
      setTheme(match?.[1] ?? '');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (theme !== 'spider-man') return null;

  return (
    <div className="theme-pet theme-pet-spider" aria-hidden="true">
      <span className="theme-pet-web web-a" />
      <span className="theme-pet-web web-b" />
      <span className="theme-pet-spider-body">
        <span className="theme-pet-eye eye-a" />
        <span className="theme-pet-eye eye-b" />
        <span className="theme-pet-leg l1" /><span className="theme-pet-leg l2" />
        <span className="theme-pet-leg l3" /><span className="theme-pet-leg l4" />
        <span className="theme-pet-leg l5" /><span className="theme-pet-leg l6" />
        <span className="theme-pet-leg l7" /><span className="theme-pet-leg l8" />
      </span>
    </div>
  );
}
