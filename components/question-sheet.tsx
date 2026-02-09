"use client"

import React from "react"

import { useState, useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"
import type { Question, Topic } from "@/lib/types"
import { SheetHeader } from "@/components/sheet-header"
import { Toolbar } from "@/components/toolbar"
import { TopicCard } from "@/components/topic-card"
import {
  TextInputDialog,
  QuestionDialog,
  NotesDialog,
  DeleteConfirmDialog,
} from "@/components/crud-dialogs"

type DialogState =
  | { type: "none" }
  | { type: "addTopic" }
  | { type: "editTopic"; topicName: string }
  | { type: "addSubTopic"; topicName: string }
  | { type: "editSubTopic"; topicName: string; subTopicName: string }
  | { type: "addQuestion"; topicName: string; subTopicName: string }
  | { type: "editQuestion"; question: Question }
  | { type: "notes"; question: Question }
  | { type: "deleteTopic"; topicName: string }
  | { type: "deleteSubTopic"; topicName: string; subTopicName: string }
  | { type: "deleteQuestion"; questionId: string }

export function QuestionSheet() {
  const topics = useStore((s) => s.topics)
  const searchQuery = useStore((s) => s.searchQuery)
  const filterDifficulty = useStore((s) => s.filterDifficulty)
  const filterStatus = useStore((s) => s.filterStatus)
  const addTopic = useStore((s) => s.addTopic)
  const editTopic = useStore((s) => s.editTopic)
  const deleteTopic = useStore((s) => s.deleteTopic)
  const addSubTopic = useStore((s) => s.addSubTopic)
  const editSubTopic = useStore((s) => s.editSubTopic)
  const deleteSubTopic = useStore((s) => s.deleteSubTopic)
  const addQuestion = useStore((s) => s.addQuestion)
  const editQuestion = useStore((s) => s.editQuestion)
  const deleteQuestion = useStore((s) => s.deleteQuestion)
  const updateNotes = useStore((s) => s.updateNotes)
  const reorderTopics = useStore((s) => s.reorderTopics)

  const [dialog, setDialog] = useState<DialogState>({ type: "none" })
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  // Filter topics based on search and filters
  const filteredTopics = useMemo(() => {
    const query = searchQuery.toLowerCase()

    return topics
      .map((topic) => {
        const filteredSubTopics = topic.subTopics
          .map((st) => {
            const filteredQuestions = st.questions.filter((q) => {
              // Search filter
              if (query) {
                const matchesTitle = q.title.toLowerCase().includes(query)
                const matchesName = q.questionId?.name?.toLowerCase().includes(query)
                const matchesTopic = q.topic.toLowerCase().includes(query)
                const matchesSubTopic = q.subTopic.toLowerCase().includes(query)
                if (!matchesTitle && !matchesName && !matchesTopic && !matchesSubTopic) return false
              }

              // Difficulty filter
              if (filterDifficulty !== "all" && q.questionId?.difficulty !== filterDifficulty) return false

              // Status filter
              if (filterStatus === "solved" && !q.isSolved) return false
              if (filterStatus === "unsolved" && q.isSolved) return false

              return true
            })
            return { ...st, questions: filteredQuestions }
          })
          .filter((st) => st.questions.length > 0 || (!query && filterDifficulty === "all" && filterStatus === "all"))

        return { ...topic, subTopics: filteredSubTopics }
      })
      .filter((t) => t.subTopics.length > 0 || (!query && filterDifficulty === "all" && filterStatus === "all"))
  }, [topics, searchQuery, filterDifficulty, filterStatus])

  const handleTopicDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleTopicDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (dragIndex !== null && dragIndex !== index) {
        reorderTopics(dragIndex, index)
        setDragIndex(index)
      }
    },
    [dragIndex, reorderTopics]
  )

  const handleTopicDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  const closeDialog = () => setDialog({ type: "none" })

  return (
    <div className="min-h-screen bg-background">
      <SheetHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Toolbar onAddTopic={() => setDialog({ type: "addTopic" })} />

        <div className="mt-6 flex flex-col gap-4">
          {filteredTopics.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <p className="text-lg font-medium text-foreground">No topics found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || filterDifficulty !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters."
                  : "Get started by adding your first topic."}
              </p>
            </div>
          ) : (
            filteredTopics.map((topic, idx) => (
              <TopicCard
                key={topic.name}
                topic={topic}
                topicIndex={idx}
                onEditTopic={(name) => setDialog({ type: "editTopic", topicName: name })}
                onDeleteTopic={(name) => setDialog({ type: "deleteTopic", topicName: name })}
                onAddSubTopic={(topicName) => setDialog({ type: "addSubTopic", topicName })}
                onEditSubTopic={(topicName, subTopicName) =>
                  setDialog({ type: "editSubTopic", topicName, subTopicName })
                }
                onDeleteSubTopic={(topicName, subTopicName) =>
                  setDialog({ type: "deleteSubTopic", topicName, subTopicName })
                }
                onAddQuestion={(topicName, subTopicName) =>
                  setDialog({ type: "addQuestion", topicName, subTopicName })
                }
                onEditQuestion={(q) => setDialog({ type: "editQuestion", question: q })}
                onDeleteQuestion={(id) => setDialog({ type: "deleteQuestion", questionId: id })}
                onNotesQuestion={(q) => setDialog({ type: "notes", question: q })}
                onDragStart={handleTopicDragStart}
                onDragOver={handleTopicDragOver}
                onDragEnd={handleTopicDragEnd}
                isDragging={dragIndex === idx}
              />
            ))
          )}
        </div>
      </main>

      {/* Add Topic Dialog */}
      <TextInputDialog
        open={dialog.type === "addTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Add Topic"
        description="Create a new topic to organize your questions."
        label="Topic Name"
        onSubmit={(name) => {
          addTopic(name)
          closeDialog()
        }}
      />

      {/* Edit Topic Dialog */}
      <TextInputDialog
        open={dialog.type === "editTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Rename Topic"
        description="Update the topic name."
        label="Topic Name"
        defaultValue={dialog.type === "editTopic" ? dialog.topicName : ""}
        onSubmit={(name) => {
          if (dialog.type === "editTopic") {
            editTopic(dialog.topicName, name)
          }
          closeDialog()
        }}
      />

      {/* Add SubTopic Dialog */}
      <TextInputDialog
        open={dialog.type === "addSubTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Add Sub-topic"
        description={
          dialog.type === "addSubTopic"
            ? `Add a sub-topic under "${dialog.topicName}".`
            : "Add a sub-topic."
        }
        label="Sub-topic Name"
        onSubmit={(name) => {
          if (dialog.type === "addSubTopic") {
            addSubTopic(dialog.topicName, name)
          }
          closeDialog()
        }}
      />

      {/* Edit SubTopic Dialog */}
      <TextInputDialog
        open={dialog.type === "editSubTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Rename Sub-topic"
        description="Update the sub-topic name."
        label="Sub-topic Name"
        defaultValue={dialog.type === "editSubTopic" ? dialog.subTopicName : ""}
        onSubmit={(name) => {
          if (dialog.type === "editSubTopic") {
            editSubTopic(dialog.topicName, dialog.subTopicName, name)
          }
          closeDialog()
        }}
      />

      {/* Add Question Dialog */}
      <QuestionDialog
        open={dialog.type === "addQuestion"}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={(data) => {
          if (dialog.type === "addQuestion") {
            addQuestion(dialog.topicName, dialog.subTopicName, {
              title: data.title,
              resource: data.resource,
              questionId: {
                _id: "",
                id: 0,
                platform: data.platform,
                slug: "",
                companyTags: [],
                createdAt: "",
                description: "",
                difficulty: data.difficulty,
                name: data.title,
                problemUrl: data.problemUrl,
                topics: [],
                updatedAt: "",
                verified: false,
              },
            })
          }
          closeDialog()
        }}
      />

      {/* Edit Question Dialog */}
      <QuestionDialog
        open={dialog.type === "editQuestion"}
        onOpenChange={(open) => !open && closeDialog()}
        question={dialog.type === "editQuestion" ? dialog.question : null}
        onSubmit={(data) => {
          if (dialog.type === "editQuestion") {
            editQuestion(dialog.question._id, {
              title: data.title,
              resource: data.resource,
              questionId: {
                ...dialog.question.questionId,
                difficulty: data.difficulty,
                problemUrl: data.problemUrl,
                platform: data.platform,
                name: data.title,
              },
            })
          }
          closeDialog()
        }}
      />

      {/* Notes Dialog */}
      <NotesDialog
        open={dialog.type === "notes"}
        onOpenChange={(open) => !open && closeDialog()}
        question={dialog.type === "notes" ? dialog.question : null}
        onSubmit={(qId, notes) => {
          updateNotes(qId, notes)
          closeDialog()
        }}
      />

      {/* Delete Topic Confirmation */}
      <DeleteConfirmDialog
        open={dialog.type === "deleteTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete Topic"
        description={
          dialog.type === "deleteTopic"
            ? `Are you sure you want to delete "${dialog.topicName}" and all its questions? This action cannot be undone.`
            : ""
        }
        onConfirm={() => {
          if (dialog.type === "deleteTopic") {
            deleteTopic(dialog.topicName)
          }
          closeDialog()
        }}
      />

      {/* Delete SubTopic Confirmation */}
      <DeleteConfirmDialog
        open={dialog.type === "deleteSubTopic"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete Sub-topic"
        description={
          dialog.type === "deleteSubTopic"
            ? `Are you sure you want to delete "${dialog.subTopicName}" and all its questions?`
            : ""
        }
        onConfirm={() => {
          if (dialog.type === "deleteSubTopic") {
            deleteSubTopic(dialog.topicName, dialog.subTopicName)
          }
          closeDialog()
        }}
      />

      {/* Delete Question Confirmation */}
      <DeleteConfirmDialog
        open={dialog.type === "deleteQuestion"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={() => {
          if (dialog.type === "deleteQuestion") {
            deleteQuestion(dialog.questionId)
          }
          closeDialog()
        }}
      />
    </div>
  )
}
