import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// 필요한건가 검토 필요
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
