'use client';

import { useEffect, useRef, useState } from 'react';
import { themePetImages } from '@/lib/theme-pet-images';

const petByTheme: Record<string, { image: string; label: string; clickEffect: string }> = {
  'harry-potter': { image: themePetImages.hp, label: 'Harry Potter companion', clickEffect: 'magic-sparkle' },
  'stranger-things': { image: themePetImages.st, label: 'Stranger Things companion', clickEffect: 'dimensional-ripple' },
  'pirates-of-the-caribbean': { image: themePetImages.pirates, label: 'Pirates companion', clickEffect: 'cannon-smoke' },
  'dark-web-series': { image: themePetImages.dark, label: 'Dark companion', clickEffect: 'security-shield' },
  'spider-man': { image: themePetImages.spider, label: 'Spider-Man companion', clickEffect: 'spider-web' },
  'batman': { image: themePetImages.batman, label: 'Batman companion', clickEffect: 'bat-signal' },
  'superman': { image: themePetImages.superman, label: 'Superman companion', clickEffect: 'energy-burst' },
};

const THEME_CLASSES = new Set(Object.keys(petByTheme));

export function ThemeEffects() {
  const [theme, setTheme] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const read = () => {
      const match = Array.from(document.body.classList).find((value) => THEME_CLASSES.has(value));
      setTheme(match ?? '');
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setIsClicked(false);
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  }, [theme]);

  const pet = petByTheme[theme];
  if (!pet) return null;

  const handlePetClick = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setIsClicked(true);
    resetTimer.current = setTimeout(() => {
      setIsClicked(false);
      resetTimer.current = null;
    }, 850);
  };

  return (
    <div className={`theme-pet-layer theme-pet-${theme} ${isClicked ? 'pet-clicked' : ''}`}>
      <div className="theme-pet-glow" aria-hidden="true" />
      <div className="theme-pet-orbit" aria-hidden="true" />
      <button
        type="button"
        className="theme-pet-interaction"
        aria-label={`Interact with ${pet.label}`}
        onClick={handlePetClick}
      >
        <img className="theme-pet-image" src={pet.image} alt="" draggable={false} />
        <span className="theme-pet-spark spark-a" aria-hidden="true" />
        <span className="theme-pet-spark spark-b" aria-hidden="true" />
        <span className={`click-effect ${pet.clickEffect} ${isClicked ? 'effect-active' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
}
