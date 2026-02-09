"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============= Text Input Dialog (for Topic/SubTopic create/edit) =============
interface TextDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  label: string
  defaultValue?: string
  onSubmit: (value: string) => void
}

export function TextInputDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  defaultValue = "",
  onSubmit,
}: TextDialogProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (open) setValue(defaultValue)
  }, [open, defaultValue])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="text-input">{label}</Label>
          <Input
            id="text-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onSubmit(value.trim())
                onOpenChange(false)
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (value.trim()) {
                onSubmit(value.trim())
                onOpenChange(false)
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============= Question Dialog (for add/edit question) =============
interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question?: Question | null
  onSubmit: (data: {
    title: string
    difficulty: string
    problemUrl: string
    resource: string
    platform: string
  }) => void
}

export function QuestionDialog({
  open,
  onOpenChange,
  question,
  onSubmit,
}: QuestionDialogProps) {
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [problemUrl, setProblemUrl] = useState("")
  const [resource, setResource] = useState("")
  const [platform, setPlatform] = useState("leetcode")

  useEffect(() => {
    if (open && question) {
      setTitle(question.title)
      setDifficulty(question.questionId?.difficulty || "Easy")
      setProblemUrl(question.questionId?.problemUrl || "")
      setResource(question.resource || "")
      setPlatform(question.questionId?.platform || "leetcode")
    } else if (open) {
      setTitle("")
      setDifficulty("Easy")
      setProblemUrl("")
      setResource("")
      setPlatform("leetcode")
    }
  }, [open, question])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add Question"}</DialogTitle>
          <DialogDescription>
            {question ? "Update the question details below." : "Fill in the details for the new question."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q-title">Title</Label>
            <Input
              id="q-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Two Sum"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="q-difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="q-platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leetcode">LeetCode</SelectItem>
                  <SelectItem value="geeksforgeeks">GeeksForGeeks</SelectItem>
                  <SelectItem value="codestudio">Code Studio</SelectItem>
                  <SelectItem value="codeforces">Codeforces</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="q-url">Problem URL</Label>
            <Input
              id="q-url"
              value={problemUrl}
              onChange={(e) => setProblemUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="q-resource">Resource / Video URL</Label>
            <Input
              id="q-resource"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (title.trim()) {
                onSubmit({ title: title.trim(), difficulty, problemUrl, resource, platform })
                onOpenChange(false)
              }
            }}
          >
            {question ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============= Notes Dialog =============
interface NotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Question | null
  onSubmit: (questionId: string, notes: string) => void
}

export function NotesDialog({
  open,
  onOpenChange,
  question,
  onSubmit,
}: NotesDialogProps) {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (open && question) {
      setNotes(question.notes || "")
    }
  }, [open, question])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Notes - {question?.title}</DialogTitle>
          <DialogDescription>
            Add personal notes, approaches, or reminders for this problem.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Your Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            rows={6}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (question) {
                onSubmit(question._id, notes)
                onOpenChange(false)
              }
            }}
          >
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============= Delete Confirmation Dialog =============
interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
