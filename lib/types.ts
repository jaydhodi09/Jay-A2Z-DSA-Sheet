export interface QuestionId {
  _id: string
  id: number
  platform: string
  slug: string
  companyTags: string[]
  createdAt: string
  description: string
  difficulty: string
  name: string
  problemUrl: string
  topics: string[]
  updatedAt: string
  verified: boolean
}

export interface Question {
  _id: string
  sheetId: string
  questionId: QuestionId
  topic: string
  title: string
  subTopic: string
  resource: string
  session: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  isSolved: boolean
  notes?: string
}

export interface SubTopic {
  name: string
  questions: Question[]
}

export interface Topic {
  name: string
  subTopics: SubTopic[]
}

export interface Sheet {
  _id: string
  author: string
  name: string
  description: string
  visibility: string
  followers: number
  tag: string[]
  createdAt: string
  updatedAt: string
  banner: string
  slug: string
}
