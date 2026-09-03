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

function colorDistance(r: number, g: number, b: number, bg: readonly number[]) {
  return Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
}

function knockoutAndCrop(source: string): Promise<string> {
  const cached = processedCache.get(source);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height || width * height > 1200000) return resolve(source);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(source);
        ctx.drawImage(image, 0, 0);

        const frame = ctx.getImageData(0, 0, width, height);
        const pixels = frame.data;
        const samplePoints: Array<[number, number]> = [];
        const inset = Math.max(1, Math.round(Math.min(width, height) * 0.01));
        for (let i = 0; i < 5; i += 1) {
          const t = i / 4;
          samplePoints.push(
            [inset + Math.round((width - inset * 2 - 1) * t), inset],
            [inset + Math.round((width - inset * 2 - 1) * t), height - inset - 1],
            [inset, inset + Math.round((height - inset * 2 - 1) * t)],
            [width - inset - 1, inset + Math.round((height - inset * 2 - 1) * t)],
          );
        }

        const samples = samplePoints.map(([x, y]) => {
          const i = (y * width + x) * 4;
          return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]] as const;
        }).filter((p) => p[3] > 0);
        if (samples.length < 4) return resolve(source);

        const bg = samples.reduce(
          (sum, p) => [sum[0] + p[0], sum[1] + p[1], sum[2] + p[2]],
          [0, 0, 0],
        ).map((value) => value / samples.length);

        const distanceAt = (index: number) => colorDistance(
          pixels[index], pixels[index + 1], pixels[index + 2], bg,
        );

        const visited = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0;
        let tail = 0;
        const enqueue = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= width || y >= height) return;
          const p = y * width + x;
          if (visited[p]) return;
          const i = p * 4;
          const alpha = pixels[i + 3];
          if (alpha === 0 || distanceAt(i) <= 58) {
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
          const distance = distanceAt(i);
          if (distance <= 34) {
            pixels[i + 3] = 0;
          } else if (distance < 82) {
            const feather = (distance - 34) / 48;
            pixels[i + 3] = Math.min(pixels[i + 3], Math.round(feather * 255));
          }

          const x = p % width;
          const y = Math.floor(p / width);
          enqueue(x - 1, y);
          enqueue(x + 1, y);
          enqueue(x, y - 1);
          enqueue(x, y + 1);
        }

        ctx.putImageData(frame, 0, 0);

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const alpha = pixels[(y * width + x) * 4 + 3];
            if (alpha > 12) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (maxX < minX || maxY < minY) return resolve(source);

        const pad = Math.max(4, Math.round(Math.min(width, height) * 0.035));
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(width - 1, maxX + pad);
        maxY = Math.min(height - 1, maxY + pad);

        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        const cropped = document.createElement('canvas');
        cropped.width = cropWidth;
        cropped.height = cropHeight;
        const cropCtx = cropped.getContext('2d');
        if (!cropCtx) return resolve(source);
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        const result = cropped.toDataURL('image/png');
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
    void knockoutAndCrop(source).then((result) => {
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
    }, 450);
  };

  return (
    <div
      className={`theme-pet-layer theme-pet-${theme}`}
      aria-label={pet.label}
      style={{
        width: 'min(176px, 22vw)',
        height: 'min(176px, 22vw)',
        right: 'clamp(12px, 2vw, 28px)',
        bottom: 'clamp(12px, 2vw, 28px)',
        animation: 'none',
        filter: 'none',
        transform: 'none',
      }}
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
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            animation: 'none',
            background: 'transparent',
            filter: 'none',
            mixBlendMode: 'normal',
          }}
        />
        {isClicked && <span className="theme-pet-click-ring" aria-hidden="true" />}
      </button>
    </div>
  );
}
