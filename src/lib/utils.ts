import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBytes = (bytes: number): string => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = sizes[Math.min(i, sizes.length - 1)];
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${size}`;
};

export const formatSpeed = (speed: number): string => {
  return speed >= 1000 ? `${(speed / 1000).toFixed(1)} MB/s` : `${speed.toFixed(1)} KB/s`
}

export const getMemoryUsagePercentage = (used: number, total: number): number => {
  return Math.round((used / total) * 100)
}