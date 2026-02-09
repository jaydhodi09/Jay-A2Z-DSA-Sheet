"use client"

import { cn } from "@/lib/utils"

const difficultyConfig: Record<string, { bg: string; text: string }> = {
  Basic: { bg: "bg-muted", text: "text-muted-foreground" },
  Easy: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  Medium: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  Hard: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = difficultyConfig[difficulty] || difficultyConfig.Easy
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      {difficulty}
    </span>
  )
}
