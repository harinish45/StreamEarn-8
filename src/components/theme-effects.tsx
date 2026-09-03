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
const processedCache = new Map<string, string>();

function knockoutBackground(source: string): Promise<string> {
  const cached = processedCache.get(source);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height || width * height > 1000000) return resolve(source);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(source);
        ctx.drawImage(image, 0, 0);

        const frame = ctx.getImageData(0, 0, width, height);
        const pixels = frame.data;
        const samplePoints = [
          [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
        ];
        const samples = samplePoints
          .map(([x, y]) => {
            const i = (y * width + x) * 4;
            return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]] as const;
          })
          .filter((p) => p[3] > 0);
        if (samples.length < 2) return resolve(source);

        const bg = samples
          .reduce((sum, p) => [sum[0] + p[0], sum[1] + p[1], sum[2] + p[2]], [0, 0, 0])
          .map((value) => value / samples.length);
        const distance = (i: number) => {
          const dr = pixels[i] - bg[0];
          const dg = pixels[i + 1] - bg[1];
          const db = pixels[i + 2] - bg[2];
          return Math.hypot(dr, dg, db);
        };

        const visited = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0;
        let tail = 0;
        const enqueue = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= width || y >= height) return;
          const p = y * width + x;
          if (visited[p]) return;
          const i = p * 4;
          if (pixels[i + 3] === 0 || distance(i) <= 64) {
            visited[p] = 1;
            queue[tail++] = p;
          }
        };

        for (let x = 0; x < width; x += 1) {
          enqueue(x, 0);
          enqueue(x, height - 1);
        }
        for (let y = 0; y < height; y += 1) {
          enqueue(0, y);
          enqueue(width - 1, y);
        }

        while (head < tail) {
          const p = queue[head++];
          const i = p * 4;
          const d = distance(i);
          if (d < 46) pixels[i + 3] = 0;
          else if (d < 76) pixels[i + 3] = Math.round(((d - 46) / 30) * pixels[i + 3]);
          const x = p % width;
          const y = Math.floor(p / width);
          enqueue(x - 1, y);
          enqueue(x + 1, y);
          enqueue(x, y - 1);
          enqueue(x, y + 1);
        }

        ctx.putImageData(frame, 0, 0);
        const result = canvas.toDataURL('image/png');
        processedCache.set(source, result);
        resolve(result);
      } catch {
        resolve(source);
      }
    };
    image.onerror = () => resolve(source);
    image.src = source;
  });
}

function scheduleProcessing(source: string, onDone: (src: string) => void) {
  let cancelled = false;
  const timer = globalThis.setTimeout(() => {
    if (cancelled) return;
    void knockoutBackground(source).then((result) => {
      if (!cancelled) onDone(result);
    });
  }, 0);
  return () => {
    cancelled = true;
    globalThis.clearTimeout(timer);
  };
}

export function ThemeEffects() {
  const [theme, setTheme] = useState('');
  const [petSrc, setPetSrc] = useState('');
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

  useEffect(() => {
    setPetSrc('');
    setIsClicked(false);
    if (clickTimer.current !== null) globalThis.clearTimeout(clickTimer.current);
    clickTimer.current = null;
    if (!pet) return;
    return scheduleProcessing(pet.image, setPetSrc);
  }, [pet]);

  useEffect(() => () => {
    if (clickTimer.current !== null) globalThis.clearTimeout(clickTimer.current);
  }, []);

  if (!pet || !petSrc) return null;

  const handlePetClick = () => {
    setIsClicked(true);
    if (clickTimer.current !== null) globalThis.clearTimeout(clickTimer.current);
    clickTimer.current = globalThis.setTimeout(() => {
      setIsClicked(false);
      clickTimer.current = null;
    }, 500);
  };

  return (
    <div
      className={`theme-pet-layer theme-pet-${theme}`}
      style={{ animation: 'none', filter: 'none' }}
      aria-label={pet.label}
    >
      <button
        type="button"
        className="theme-pet-interaction"
        aria-label={pet.label}
        onClick={handlePetClick}
        style={{ animation: 'none', background: 'transparent' }}
      >
        <img
          className="theme-pet-image"
          src={petSrc}
          alt=""
          draggable={false}
          style={{ animation: 'none', background: 'transparent' }}
        />
        {isClicked && <span className="theme-pet-click-ring" aria-hidden="true" />}
      </button>
    </div>
  );
}
