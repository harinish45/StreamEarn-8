'use client';

import { useEffect, useRef, useState } from 'react';
import { themePetImages } from '@/lib/theme-pet-images';

const petByTheme: Record<string, { image: string; label: string; clickEffect: string }> = {
  'harry-potter': { image: themePetImages.hp, label: 'Harry Potter companion', clickEffect: 'magic-sparkle' },
  'stranger-things': { image: themePetImages.st, label: 'Stranger Things companion', clickEffect: 'dimensional-ripple' },
  'pirates-of-the-caribbean': { image: themePetImages.pirates, label: 'Pirates companion', clickEffect: 'cannon-smoke' },
  'dark-web-series': { image: themePetImages.dark, label: 'Dark Web Series companion', clickEffect: 'security-shield' },
  'spider-man': { image: themePetImages.spider, label: 'Spider-Man companion', clickEffect: 'spider-web' },
  'batman': { image: themePetImages.batman, label: 'Batman companion', clickEffect: 'bat-signal' },
  'superman': { image: themePetImages.superman, label: 'Superman companion', clickEffect: 'energy-burst' },
  'light': { image: themePetImages.light, label: 'Light companion', clickEffect: 'magic-sparkle' },
};

const THEME_CLASSES = new Set(Object.keys(petByTheme));

function knockoutBackground(source: string): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) return resolve(source);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(source);
        ctx.drawImage(image, 0, 0);
        const frame = ctx.getImageData(0, 0, width, height);
        const pixels = frame.data;
        const point = (x: number, y: number) => {
          const i = (y * width + x) * 4;
          return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]] as const;
        };
        const samples = [point(1, 1), point(width - 2, 1), point(1, height - 2), point(width - 2, height - 2)].filter(p => p[3] > 0);
        if (samples.length < 2) return resolve(source);
        const bg = samples.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map(v => v / samples.length);
        const dist = (i: number) => {
          const dr = pixels[i] - bg[0], dg = pixels[i + 1] - bg[1], db = pixels[i + 2] - bg[2];
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };
        const visited = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0, tail = 0;
        const enqueue = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= width || y >= height) return;
          const p = y * width + x;
          if (visited[p]) return;
          const i = p * 4;
          if (pixels[i + 3] === 0 || dist(i) <= 64) { visited[p] = 1; queue[tail++] = p; }
        };
        for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
        for (let y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }
        while (head < tail) {
          const p = queue[head++];
          const i = p * 4;
          const d = dist(i);
          if (d < 46) pixels[i + 3] = 0;
          else if (d < 76) pixels[i + 3] = Math.round(((d - 46) / 30) * pixels[i + 3]);
          const x = p % width, y = Math.floor(p / width);
          enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
        }
        ctx.putImageData(frame, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch { resolve(source); }
    };
    image.onerror = () => resolve(source);
    image.src = source;
  });
}

export function ThemeEffects() {
  const [theme, setTheme] = useState('');
  const [petSrc, setPetSrc] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const read = () => setTheme(Array.from(document.body.classList).find((value) => THEME_CLASSES.has(value)) ?? '');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const pet = petByTheme[theme];

  useEffect(() => {
    let cancelled = false;
    setPetSrc('');
    setIsClicked(false);
    if (timer.current) clearTimeout(timer.current);
    if (!pet) return () => { cancelled = true; };
    void knockoutBackground(pet.image).then((processed) => { if (!cancelled) setPetSrc(processed); });
    return () => { cancelled = true; };
  }, [pet]);

  if (!pet || !petSrc) return null;

  const handlePetClick = () => {
    if (timer.current) clearTimeout(timer.current);
    setIsClicked(true);
    timer.current = setTimeout(() => { setIsClicked(false); timer.current = null; }, 850);
  };

  return (
    <>
      <div className={`theme-pet-layer theme-pet-${theme}`}>
        <div className="theme-pet-glow" aria-hidden="true" />
        <div className="theme-pet-orbit" aria-hidden="true" />
        <button type="button" className="theme-pet-interaction" aria-label={`Interact with ${pet.label}`} onClick={handlePetClick}>
          <img className="theme-pet-image" src={petSrc} alt="" draggable={false} />
          <span className={`theme-pet-spark spark-a ${isClicked ? 'spark-active' : ''}`} aria-hidden="true" />
          <span className={`theme-pet-spark spark-b ${isClicked ? 'spark-active' : ''}`} aria-hidden="true" />
          <span className={`click-effect ${pet.clickEffect} ${isClicked ? 'effect-active' : ''}`} aria-hidden="true" />
        </button>
      </div>
      {(theme === 'pirates-of-the-caribbean' || theme === 'spider-man') && <div className={`theme-sidebar-rope theme-rope-${theme}`} aria-hidden="true" />}
    </>
  );
}
