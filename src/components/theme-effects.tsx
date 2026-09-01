'use client';

import { useEffect, useState } from 'react';
import { themePetImages } from '@/lib/theme-pet-images';

const petByTheme: Record<string, { image: string; label: string }> = {
  'harry-potter': { image: themePetImages.hp, label: 'Harry Potter companion' },
  'stranger-things': { image: themePetImages.st, label: 'Stranger Things companion' },
  'pirates-of-the-caribbean': { image: themePetImages.pirates, label: 'Pirates companion' },
  'dark-web-series': { image: themePetImages.dark, label: 'Dark companion' },
  'spider-man': { image: themePetImages.spider, label: 'Spider-Man companion' },
  'batman': { image: themePetImages.batman, label: 'Batman companion' },
};

export function ThemeEffects() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const read = () => {
      const classes = Array.from(document.body.classList);
      const match = classes.find((value) => value === 'harry-potter' || value === 'stranger-things' || value === 'pirates-of-the-caribbean' || value === 'dark-web-series' || value === 'spider-man' || value === 'batman');
      setTheme(match ?? '');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pet = petByTheme[theme];
  if (!pet) return null;

  return (
    <div className={`theme-pet-layer theme-pet-${theme}`} aria-hidden="true">
      <div className="theme-pet-glow" />
      <div className="theme-pet-orbit" />
      <img
        className="theme-pet-image"
        src={pet.image}
        alt={pet.label}
        draggable={false}
      />
      <div className="theme-pet-spark spark-a" />
      <div className="theme-pet-spark spark-b" />
    </div>
  );
}
