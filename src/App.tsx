import { useMemo, useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { appStateContext } from './lib/appState'
import type { AppPage } from './lib/appState'
import { Analytics } from './pages/Analytics'
import { AiTutor } from './pages/AiTutor'
import { ClassManagement } from './pages/ClassManagement'
import { QuizEditor } from './pages/QuizEditor'
import { QuizTaking } from './pages/QuizTaking'
import { ResultPage } from './pages/ResultPage'
import { SettingsPage } from './pages/Settings'
import { StudentsPage } from './pages/Students'
import { StudentDashboard } from './pages/StudentDashboard'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { quizBank } from './data/mockData'
import type { AppUser, Language } from './types'

function App() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [language, setLanguage] = useState<Language>('vi')
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard')
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState(quizBank.title)

  const value = useMemo(
    () => ({
      user,
      language,
      appMode: 'mock' as const,
      currentPage,
      quizScore,
      draftTitle,
      setUser: (nextUser: AppUser | null) => {
        setUser(nextUser)
        setCurrentPage('dashboard')
      },
      setLanguage,
      setCurrentPage,
      setQuizScore,
      setDraftTitle,
    }),
    [currentPage, draftTitle, language, quizScore, user],
  )

  if (!user) {
    return (
      <appStateContext.Provider value={value}>
        <AuthGate />
      </appStateContext.Provider>
    )
  }

  const isTeacher = user.role === 'teacher'
  let page

  switch (currentPage) {
    case 'classes':
      page = isTeacher ? <ClassManagement /> : <StudentDashboard />
      break
    case 'students':
      page = isTeacher ? <StudentsPage /> : <StudentDashboard />
      break
    case 'assignments':
      page = isTeacher ? <QuizEditor /> : <QuizTaking />
      break
    case 'quiz-taking':
      page = <QuizTaking />
      break
    case 'result':
      page = <ResultPage />
      break
    case 'progress':
      page = isTeacher ? <TeacherDashboard /> : <Analytics />
      break
    case 'ai-tutor':
      page = <AiTutor />
      break
    case 'analytics':
      page = isTeacher ? <Analytics /> : <StudentDashboard />
      break
    case 'settings':
      page = <SettingsPage />
      break
    case 'dashboard':
    default:
      page = isTeacher ? <TeacherDashboard /> : <StudentDashboard />
  }

  return (
    <appStateContext.Provider value={value}>
      {page}
    </appStateContext.Provider>
  )
}

export default App
