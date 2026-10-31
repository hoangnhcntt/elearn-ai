import type { Assignment, Attempt, LessonClass, Quiz, StudentProfile, TeacherProfile } from '../types'

export const teacherProfile: TeacherProfile = {
  id: 'teacher-1',
  name: 'Ms. Nguyen Lan',
  email: 'lan@elearn-ai.local',
  role: 'teacher',
  language: 'vi',
  classIds: ['class-1', 'class-2'],
}

export const students: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'Anh Tran',
    email: 'anh@elearn-ai.local',
    role: 'student',
    language: 'vi',
    level: 'A2',
    classId: 'class-1',
    lastScore: 86,
    progress: 78,
  },
  {
    id: 'student-2',
    name: 'Minh Le',
    email: 'minh@elearn-ai.local',
    role: 'student',
    language: 'en',
    level: 'B1',
    classId: 'class-1',
    lastScore: 91,
    progress: 84,
  },
  {
    id: 'student-3',
    name: 'Hieu Pham',
    email: 'hieu@elearn-ai.local',
    role: 'student',
    language: 'vi',
    level: 'A1',
    classId: 'class-2',
    lastScore: 72,
    progress: 65,
  },
]

export const classes: LessonClass[] = [
  { id: 'class-1', name: 'Elementary English 2026', level: 'A2', teacherId: 'teacher-1', studentCount: 18, nextLesson: 'Daily conversation practice' },
  { id: 'class-2', name: 'Beginner Booster', level: 'A1', teacherId: 'teacher-1', studentCount: 12, nextLesson: 'Vocabulary fundamentals' },
]

export const assignments: Assignment[] = [
  {
    id: 'assignment-1',
    classId: 'class-1',
    title: 'Daily Practice: Travel Vocabulary',
    level: 'A2',
    difficulty: 68,
    dueDate: '2026-11-05',
    status: 'in_progress',
    completionRate: 72,
    aiGenerated: true,
    type: 'quiz',
  },
  {
    id: 'assignment-2',
    classId: 'class-1',
    title: 'Writing Task: Describe a Place',
    level: 'B1',
    difficulty: 74,
    dueDate: '2026-11-07',
    status: 'submitted',
    completionRate: 90,
    aiGenerated: true,
    type: 'writing',
  },
  {
    id: 'assignment-3',
    classId: 'class-2',
    title: 'Grammar Review',
    level: 'A1',
    difficulty: 58,
    dueDate: '2026-11-04',
    status: 'overdue',
    completionRate: 45,
    aiGenerated: false,
    type: 'practice',
  },
]

export const quizBank: Quiz = {
  id: 'quiz-1',
  title: 'Travel Vocabulary & Grammar Check',
  level: 'A2',
  timeLimitMinutes: 25,
  questionCount: 3,
  dueDate: '2026-11-05',
  questions: [
    {
      id: 'q-1',
      type: 'multiple-choice',
      prompt: 'Choose the correct sentence.',
      choices: ['I am going to the station yesterday.', 'I went to the station yesterday.', 'I go to the station yesterday.', 'I was going to the station yesterday.'],
      answer: 'I went to the station yesterday.',
      explanation: 'Use the past simple for a completed event in the past.',
    },
    {
      id: 'q-2',
      type: 'fill-in-the-blanks',
      prompt: 'Complete the sentence: We ____ at the airport two hours before the flight.',
      choices: ['arrived', 'arrive', 'will arrive', 'arriving'],
      answer: 'arrived',
      explanation: 'The sentence refers to a past action, so the past simple is required.',
    },
    {
      id: 'q-3',
      type: 'true-false',
      prompt: 'A tourist can ask: “Could you tell me how to get to the museum?”',
      choices: ['True', 'False'],
      answer: 'True',
      explanation: 'This is a natural and polite way to ask for directions.',
    },
  ],
}

export const attempts: Attempt[] = [
  { id: 'attempt-1', studentId: 'student-1', assignmentId: 'assignment-1', score: 86, completedAt: '2026-10-29', status: 'passed' },
  { id: 'attempt-2', studentId: 'student-2', assignmentId: 'assignment-2', score: 91, completedAt: '2026-10-30', status: 'passed' },
  { id: 'attempt-3', studentId: 'student-3', assignmentId: 'assignment-3', score: 72, completedAt: '2026-10-24', status: 'review' },
]
