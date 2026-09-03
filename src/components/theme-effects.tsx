'use client';

import { useEffect, useState } from 'react';
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

export function ThemeEffects() {
  const [theme, setTheme] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const read = () => {
      const classes = Array.from(document.body.classList);
      const match = classes.find((value) => 
        value === 'harry-potter' || value === 'stranger-things' || value === 'pirates-of-the-caribbean' || 
        value === 'dark-web-series' || value === 'spider-man' || value === 'batman' || value === 'superman'
      );
      setTheme(match ?? '');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pet = petByTheme[theme];
  if (!pet) return null;

  const handlePetClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000); // Reset after 1 second
  };

  return (
    <div 
      className={`theme-pet-layer theme-pet-${theme} ${isClicked ? 'pet-clicked' : ''}`} 
      aria-hidden="true"
      onClick={handlePetClick}
      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      title={`Click to interact with ${pet.label}`}
    >
      <div className="theme-pet-glow" />
      <div className="theme-pet-orbit" />
      <img
        className="theme-pet-image"
        src={pet.image}
        alt={pet.label}
        draggable={false}
      />
      <div className={`theme-pet-spark spark-a ${isClicked ? 'spark-active' : ''}`} />
      <div className={`theme-pet-spark spark-b ${isClicked ? 'spark-active' : ''}`} />
      <div className={`click-effect ${pet.clickEffect} ${isClicked ? 'effect-active' : ''}`} />
    </div>
  );
}