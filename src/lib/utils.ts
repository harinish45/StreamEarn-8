import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to convert DB tasks (with _id) to frontend tasks (with id)
export const fromDb = (item: any) => {
  if (!item) return null;
  const { _id, ...rest } = item;
  return { ...rest, id: _id.toString() };
};

export function getFaviconUrl(url: string) {
  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${urlObject.hostname}`;
  } catch (error) {
    // Return a default or placeholder icon if the URL is invalid
    return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22></circle></svg>';
  }
}
