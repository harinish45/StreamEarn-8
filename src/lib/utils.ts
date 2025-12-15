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
