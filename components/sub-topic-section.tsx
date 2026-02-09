"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import type { Question, SubTopic } from "@/lib/types"
import { QuestionRow } from "@/components/question-row"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, GripVertical, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubTopicSectionProps {
  topicName: string
  subTopic: SubTopic
  subTopicIndex: number
  onAddQuestion: (topicName: string, subTopicName: string) => void
  onEditQuestion: (q: Question) => void
  onDeleteQuestion: (id: string) => void
  onNotesQuestion: (q: Question) => void
  onEditSubTopic: (topicName: string, subTopicName: string) => void
  onDeleteSubTopic: (topicName: string, subTopicName: string) => void
  onSubDragStart: (e: React.DragEvent, index: number) => void
  onSubDragOver: (e: React.DragEvent, index: number) => void
  onSubDragEnd: () => void
  isSubDragging: boolean
}

export function SubTopicSection({
  topicName,
  subTopic,
  subTopicIndex,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onNotesQuestion,
  onEditSubTopic,
  onDeleteSubTopic,
  onSubDragStart,
  onSubDragOver,
  onSubDragEnd,
  isSubDragging,
}: SubTopicSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const reorderQuestions = useStore((s) => s.reorderQuestions)

  const solved = subTopic.questions.filter((q) => q.isSolved).length
  const total = subTopic.questions.length

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (dragIndex !== null && dragIndex !== index) {
        reorderQuestions(topicName, subTopic.name, dragIndex, index)
        setDragIndex(index)
      }
    },
    [dragIndex, topicName, subTopic.name, reorderQuestions]
  )

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  return (
    <div
      draggable
      onDragStart={(e) => onSubDragStart(e, subTopicIndex)}
      onDragOver={(e) => onSubDragOver(e, subTopicIndex)}
      onDragEnd={onSubDragEnd}
      className={cn(
        "rounded-md transition-all",
        isSubDragging && "opacity-50 ring-2 ring-primary/30"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="cursor-grab text-muted-foreground active:cursor-grabbing"
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Drag to reorder sub-topic"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <CollapsibleTrigger className="flex flex-1 items-center gap-2">
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-90"
                )}
              />
              <span className="text-sm font-medium text-foreground">{subTopic.name}</span>
              <span className="text-xs text-muted-foreground">
                ({solved}/{total})
              </span>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onAddQuestion(topicName, subTopic.name)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only">Add question</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Sub-topic actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditSubTopic(topicName, subTopic.name)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteSubTopic(topicName, subTopic.name)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CollapsibleContent>
          <div className="ml-4 border-l border-border pl-3">
            {subTopic.questions.length === 0 ? (
              <p className="py-3 text-center text-sm text-muted-foreground">
                No questions yet.{" "}
                <button
                  type="button"
                  onClick={() => onAddQuestion(topicName, subTopic.name)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Add one
                </button>
              </p>
            ) : (
              subTopic.questions.map((q, idx) => (
                <QuestionRow
                  key={q._id}
                  question={q}
                  index={idx}
                  onEdit={onEditQuestion}
                  onDelete={onDeleteQuestion}
                  onNotes={onNotesQuestion}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIndex === idx}
                />
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
