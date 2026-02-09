"use client"

import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle2, BarChart3 } from "lucide-react"

export function SheetHeader() {
  const sheet = useStore((s) => s.sheet)
  const questions = useStore((s) => s.questions)
  const topics = useStore((s) => s.topics)

  const totalQuestions = questions.length
  const solvedQuestions = questions.filter((q) => q.isSolved).length
  const progressPercent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
                {sheet.name}
              </h1>
              {sheet.tag.map((t) => (
                <Badge key={t} variant="secondary" className="capitalize">
                  {t}
                </Badge>
              ))}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {sheet.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <BookOpen className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
              <p className="text-lg font-semibold text-foreground">{totalQuestions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solved</p>
              <p className="text-lg font-semibold text-foreground">
                {solvedQuestions} / {totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <BarChart3 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Topics</p>
              <p className="text-lg font-semibold text-foreground">{topics.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="mt-2 h-2" />
        </div>
      </div>
    </header>
  )
}
