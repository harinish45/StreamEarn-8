'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { themePetImages } from '@/lib/theme-pet-images';

type Pet = { image: string; label: string };

const petByTheme: Record<string, Pet> = {
  'harry-potter': { image: themePetImages.hp, label: 'Harry Potter companion' },
  'stranger-things': { image: themePetImages.st, label: 'Stranger Things companion' },
  'pirates-of-the-caribbean': { image: themePetImages.pirates, label: 'Pirates companion' },
  'dark-web-series': { image: themePetImages.dark, label: 'Dark Web Series companion' },
  'spider-man': { image: themePetImages.spider, label: 'Spider-Man companion' },
  'batman': { image: themePetImages.batman, label: 'Batman companion' },
  'superman': { image: themePetImages.superman, label: 'Superman companion' },
  'light': { image: themePetImages.light, label: 'Light companion' },
};

const THEME_CLASSES = new Set(Object.keys(petByTheme));

export function ThemeEffects() {
  const [theme, setTheme] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const clickTimer = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const pet = useMemo(() => petByTheme[theme], [theme]);

  useEffect(() => {
    const read = () => {
      setTheme(Array.from(document.body.classList).find((value) => THEME_CLASSES.has(value)) ?? '');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (clickTimer.current !== null) globalThis.clearTimeout(clickTimer.current);
  }, []);

  if (!pet) return null;

  const handlePetClick = () => {
    setIsClicked(true);
    if (clickTimer.current !== null) globalThis.clearTimeout(clickTimer.current);
    clickTimer.current = globalThis.setTimeout(() => {
      setIsClicked(false);
      clickTimer.current = null;
    }, 450);
  };

  return (
    <div className={`theme-pet-layer theme-pet-${theme}`} aria-label={pet.label}>
      <button type="button" className="theme-pet-interaction" aria-label={pet.label} onClick={handlePetClick}>
        <img className="theme-pet-image" src={pet.image} alt="" draggable={false} />
        {isClicked && <span className="theme-pet-click-ring" aria-hidden="true" />}
      </button>
    </div>
  );
}
