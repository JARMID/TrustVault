import { clsx, type ClassValue } from 'clsx';

/**
 * Utility for merging Tailwind CSS class names with conflict resolution.
 * Compatible with shadcn/ui component patterns.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

