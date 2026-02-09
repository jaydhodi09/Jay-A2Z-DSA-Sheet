"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import type { Topic, Question } from "@/lib/types"
import { SubTopicSection } from "@/components/sub-topic-section"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, GripVertical, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicCardProps {
  topic: Topic
  topicIndex: number
  onEditTopic: (name: string) => void
  onDeleteTopic: (name: string) => void
  onAddSubTopic: (topicName: string) => void
  onEditSubTopic: (topicName: string, subTopicName: string) => void
  onDeleteSubTopic: (topicName: string, subTopicName: string) => void
  onAddQuestion: (topicName: string, subTopicName: string) => void
  onEditQuestion: (q: Question) => void
  onDeleteQuestion: (id: string) => void
  onNotesQuestion: (q: Question) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  isDragging: boolean
}

export function TopicCard({
  topic,
  topicIndex,
  onEditTopic,
  onDeleteTopic,
  onAddSubTopic,
  onEditSubTopic,
  onDeleteSubTopic,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onNotesQuestion,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: TopicCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const totalQuestions = topic.subTopics.reduce((acc, st) => acc + st.questions.length, 0)
  const solvedQuestions = topic.subTopics.reduce(
    (acc, st) => acc + st.questions.filter((q) => q.isSolved).length,
    0
  )
  const progressPercent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0

  return (
    <div
      draggable
      onDragStart={() => onDragStart(topicIndex)}
      onDragOver={(e) => onDragOver(e, topicIndex)}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-all",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-3 p-4">
          <button
            type="button"
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label="Drag to reorder topic"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <CollapsibleTrigger className="flex flex-1 items-center gap-3">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">
                  {topicIndex + 1}. {topic.name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {solvedQuestions}/{totalQuestions} solved
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={progressPercent} className="h-1.5 flex-1" />
                <span className="text-xs font-medium text-muted-foreground">{progressPercent}%</span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Topic actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTopic(topic.name)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Rename Topic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSubTopic(topic.name)}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Sub-topic
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteTopic(topic.name)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Topic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CollapsibleContent>
          <div className="border-t border-border px-4 pb-4 pt-2">
            {topic.subTopics.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No sub-topics yet.{" "}
                <button
                  type="button"
                  onClick={() => onAddSubTopic(topic.name)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Add one
                </button>
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {topic.subTopics.map((st) => (
                  <SubTopicSection
                    key={st.name}
                    topicName={topic.name}
                    subTopic={st}
                    onAddQuestion={onAddQuestion}
                    onEditQuestion={onEditQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onNotesQuestion={onNotesQuestion}
                    onEditSubTopic={onEditSubTopic}
                    onDeleteSubTopic={onDeleteSubTopic}
                  />
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
