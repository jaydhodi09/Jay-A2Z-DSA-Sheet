import { create } from "zustand"
import type { Question, Topic, Sheet } from "./types"
import dataset from "./dataset.json"

function buildHierarchy(questions: Question[]): Topic[] {
  const topicMap = new Map<string, Map<string, Question[]>>()
  const topicOrder: string[] = []

  for (const q of questions) {
    const topicName = q.topic || "Uncategorized"
    const subTopicName = q.subTopic || "General"

    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, new Map())
      topicOrder.push(topicName)
    }

    const subMap = topicMap.get(topicName)!
    if (!subMap.has(subTopicName)) {
      subMap.set(subTopicName, [])
    }
    subMap.get(subTopicName)!.push(q)
  }

  return topicOrder.map((topicName) => {
    const subMap = topicMap.get(topicName)!
    const subTopics = Array.from(subMap.entries()).map(([name, questions]) => ({
      name,
      questions,
    }))
    return { name: topicName, subTopics }
  })
}

// Strip popularSheets to keep state lean
const rawQuestions: Question[] = (dataset.data.questions as unknown as Question[]).map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ ...q }) => ({
    _id: q._id,
    sheetId: q.sheetId,
    questionId: q.questionId,
    topic: q.topic,
    title: q.title,
    subTopic: q.subTopic,
    resource: q.resource,
    session: q.session,
    isPublic: q.isPublic,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    isSolved: q.isSolved,
    notes: "",
  })
)

interface StoreState {
  sheet: Sheet
  questions: Question[]
  topics: Topic[]
  searchQuery: string
  filterDifficulty: string
  filterStatus: string

  // Actions
  setSearchQuery: (q: string) => void
  setFilterDifficulty: (d: string) => void
  setFilterStatus: (s: string) => void
  toggleSolved: (questionId: string) => void
  addTopic: (name: string) => void
  editTopic: (oldName: string, newName: string) => void
  deleteTopic: (name: string) => void
  addSubTopic: (topicName: string, subTopicName: string) => void
  editSubTopic: (topicName: string, oldName: string, newName: string) => void
  deleteSubTopic: (topicName: string, subTopicName: string) => void
  addQuestion: (topicName: string, subTopicName: string, question: Partial<Question>) => void
  editQuestion: (questionId: string, updates: Partial<Question>) => void
  deleteQuestion: (questionId: string) => void
  updateNotes: (questionId: string, notes: string) => void
  reorderTopics: (fromIndex: number, toIndex: number) => void
  reorderSubTopics: (topicName: string, fromIndex: number, toIndex: number) => void
  reorderQuestions: (topicName: string, subTopicName: string, fromIndex: number, toIndex: number) => void
}

export const useStore = create<StoreState>((set) => ({
  sheet: dataset.data.sheet as Sheet,
  questions: rawQuestions,
  topics: buildHierarchy(rawQuestions),
  searchQuery: "",
  filterDifficulty: "all",
  filterStatus: "all",

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterDifficulty: (d) => set({ filterDifficulty: d }),
  setFilterStatus: (s) => set({ filterStatus: s }),

  toggleSolved: (questionId) =>
    set((state) => {
      const questions = state.questions.map((q) =>
        q._id === questionId ? { ...q, isSolved: !q.isSolved } : q
      )
      return { questions, topics: buildHierarchy(questions) }
    }),

  addTopic: (name) =>
    set((state) => {
      const topics = [...state.topics, { name, subTopics: [] }]
      return { topics }
    }),

  editTopic: (oldName, newName) =>
    set((state) => {
      const questions = state.questions.map((q) =>
        q.topic === oldName ? { ...q, topic: newName } : q
      )
      const topics = state.topics.map((t) =>
        t.name === oldName ? { ...t, name: newName } : t
      )
      return { questions, topics }
    }),

  deleteTopic: (name) =>
    set((state) => {
      const questions = state.questions.filter((q) => q.topic !== name)
      const topics = state.topics.filter((t) => t.name !== name)
      return { questions, topics }
    }),

  addSubTopic: (topicName, subTopicName) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.name === topicName
          ? { ...t, subTopics: [...t.subTopics, { name: subTopicName, questions: [] }] }
          : t
      )
      return { topics }
    }),

  editSubTopic: (topicName, oldName, newName) =>
    set((state) => {
      const questions = state.questions.map((q) =>
        q.topic === topicName && q.subTopic === oldName ? { ...q, subTopic: newName } : q
      )
      const topics = state.topics.map((t) =>
        t.name === topicName
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.name === oldName ? { ...st, name: newName } : st
              ),
            }
          : t
      )
      return { questions, topics }
    }),

  deleteSubTopic: (topicName, subTopicName) =>
    set((state) => {
      const questions = state.questions.filter(
        (q) => !(q.topic === topicName && q.subTopic === subTopicName)
      )
      const topics = state.topics.map((t) =>
        t.name === topicName
          ? { ...t, subTopics: t.subTopics.filter((st) => st.name !== subTopicName) }
          : t
      )
      return { questions, topics }
    }),

  addQuestion: (topicName, subTopicName, question) =>
    set((state) => {
      const newQ: Question = {
        _id: `custom-${Date.now()}`,
        sheetId: state.sheet._id,
        questionId: {
          _id: `qid-${Date.now()}`,
          id: Date.now(),
          platform: question.questionId?.platform || "custom",
          slug: question.title?.toLowerCase().replace(/\s+/g, "-") || "untitled",
          companyTags: [],
          createdAt: new Date().toISOString(),
          description: "",
          difficulty: question.questionId?.difficulty || "Easy",
          name: question.title || "Untitled",
          problemUrl: question.questionId?.problemUrl || "",
          topics: [],
          updatedAt: new Date().toISOString(),
          verified: false,
        },
        topic: topicName,
        title: question.title || "Untitled",
        subTopic: subTopicName,
        resource: question.resource || "",
        session: state.sheet.slug,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSolved: false,
        notes: "",
      }
      const questions = [...state.questions, newQ]
      return { questions, topics: buildHierarchy(questions) }
    }),

  editQuestion: (questionId, updates) =>
    set((state) => {
      const questions = state.questions.map((q) =>
        q._id === questionId ? { ...q, ...updates } : q
      )
      return { questions, topics: buildHierarchy(questions) }
    }),

  deleteQuestion: (questionId) =>
    set((state) => {
      const questions = state.questions.filter((q) => q._id !== questionId)
      return { questions, topics: buildHierarchy(questions) }
    }),

  updateNotes: (questionId, notes) =>
    set((state) => {
      const questions = state.questions.map((q) =>
        q._id === questionId ? { ...q, notes } : q
      )
      return { questions, topics: buildHierarchy(questions) }
    }),

  reorderTopics: (fromIndex, toIndex) =>
    set((state) => {
      const topics = [...state.topics]
      const [moved] = topics.splice(fromIndex, 1)
      topics.splice(toIndex, 0, moved)
      return { topics }
    }),

  reorderSubTopics: (topicName, fromIndex, toIndex) =>
    set((state) => {
      const topics = state.topics.map((t) => {
        if (t.name !== topicName) return t
        const subTopics = [...t.subTopics]
        const [moved] = subTopics.splice(fromIndex, 1)
        subTopics.splice(toIndex, 0, moved)
        return { ...t, subTopics }
      })
      return { topics }
    }),

  reorderQuestions: (topicName, subTopicName, fromIndex, toIndex) =>
    set((state) => {
      const topics = state.topics.map((t) => {
        if (t.name !== topicName) return t
        const subTopics = t.subTopics.map((st) => {
          if (st.name !== subTopicName) return st
          const questions = [...st.questions]
          const [moved] = questions.splice(fromIndex, 1)
          questions.splice(toIndex, 0, moved)
          return { ...st, questions }
        })
        return { ...t, subTopics }
      })
      return { topics }
    }),
}))
