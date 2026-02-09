"use client"

import React from "react"

import { useStore } from "@/lib/store"
import type { Question } from "@/lib/types"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ExternalLink,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  Video,
  StickyNote,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionRowProps {
  question: Question
  index: number
  onEdit: (q: Question) => void
  onDelete: (id: string) => void
  onNotes: (q: Question) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  isDragging: boolean
}

export function QuestionRow({
  question,
  index,
  onEdit,
  onDelete,
  onNotes,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: QuestionRowProps) {
  const toggleSolved = useStore((s) => s.toggleSolved)

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-accent/50",
        isDragging && "opacity-50",
        question.isSolved && "bg-accent/30"
      )}
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Checkbox
        checked={question.isSolved}
        onCheckedChange={() => toggleSolved(question._id)}
        aria-label={`Mark ${question.title} as ${question.isSolved ? "unsolved" : "solved"}`}
      />

      <span className="min-w-8 text-xs text-muted-foreground">{index + 1}.</span>

      <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <span
          className={cn(
            "font-medium text-sm text-foreground",
            question.isSolved && "line-through text-muted-foreground"
          )}
        >
          {question.title}
        </span>
        <DifficultyBadge difficulty={question.questionId?.difficulty || "Easy"} />
        {question.questionId?.platform && (
          <span className="text-xs capitalize text-muted-foreground">
            {question.questionId.platform}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {question.questionId?.problemUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <a
              href={question.questionId.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open problem"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {question.resource && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <a
              href={question.resource}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch video resource"
            >
              <Video className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {question.notes && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary"
            onClick={() => onNotes(question)}
            aria-label="View notes"
          >
            <StickyNote className="h-3.5 w-3.5" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(question)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNotes(question)}>
              <StickyNote className="mr-2 h-3.5 w-3.5" />
              Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(question._id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
