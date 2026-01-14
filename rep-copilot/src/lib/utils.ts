import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn() - The magic class name merger
 *
 * Combines clsx (conditional classes) + tailwind-merge (smart Tailwind merging)
 *
 * @example
 * cn("px-4 py-2", "px-6")  // Result: "px-6 py-2" (merges px, doesn't override py)
 * cn("base-class", isActive && "active-class", className)  // Conditional + prop override
 *
 * Why use it?
 * - Prevents Tailwind class conflicts (last wins becomes smart merge)
 * - Allows conditional classes (ternaries, &&, ||)
 * - Lets components accept className prop for customization
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
