import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: any): string {
  const detail = err.response?.data?.detail;
  if (!detail) {
    return '';
  }
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail
      .map((e: any) => {
        const field = e.loc ? e.loc.filter((l: any) => l !== 'body').join('.') : '';
        return `${field ? field + ': ' : ''}${e.msg || 'Invalid value'}`;
      })
      .join(', ');
  }
  if (typeof detail === 'object') {
    return detail.message || JSON.stringify(detail);
  }
  return String(detail);
}
