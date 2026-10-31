export type Role = 'teacher' | 'student'
export type Language = 'vi' | 'en'
export type Difficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'IELTS'
export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'overdue'
export type QuestionType = 'multiple-choice' | 'fill-in-the-blanks' | 'true-false' | 'matching' | 'writing'

export type TeacherProfile = {
  id: string
  name: string
  email: string
  role: 'teacher'
  language: Language
  classIds: string[]
}

export type StudentProfile = {
  id: string
  name: string
  email: string
  role: 'student'
  language: Language
  level: Difficulty
  classId: string
  lastScore: number
  progress: number
}

export type AppUser = TeacherProfile | StudentProfile

export type LessonClass = {
  id: string
  name: string
  level: Difficulty
  teacherId: string
  studentCount: number
  nextLesson: string
}

export type Assignment = {
  id: string
  classId: string
  title: string
  level: Difficulty
  difficulty: number
  dueDate: string
  status: AssignmentStatus
  completionRate: number
  aiGenerated: boolean
  type: 'quiz' | 'writing' | 'practice'
}

export type QuizQuestion = {
  id: string
  type: QuestionType
  prompt: string
  choices?: string[]
  answer: string
  explanation: string
}

export type Quiz = {
  id: string
  title: string
  level: Difficulty
  timeLimitMinutes: number
  questionCount: number
  dueDate: string
  questions: QuizQuestion[]
}

export type Attempt = {
  id: string
  studentId: string
  assignmentId: string
  score: number
  completedAt: string
  status: 'passed' | 'review'
}
