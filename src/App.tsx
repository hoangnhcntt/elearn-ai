import { useEffect, useMemo, useState } from 'react'
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
import { forgetDemoUser, getRememberedUser } from './lib/demoAuth'
import { getCloudflareUser, signOutFromCloudflare } from './lib/cloudflareAuth'
import type { AppMode } from './lib/appState'
import type { AppUser, Language } from './types'

function App() {
  const appMode: AppMode = import.meta.env.VITE_APP_MODE === 'mock' ? 'mock' : 'live'
  const [user, setUser] = useState<AppUser | null>(() => appMode === 'mock' ? getRememberedUser() : null)
  const [isCheckingSession, setIsCheckingSession] = useState(appMode === 'live')
  const [authError, setAuthError] = useState('')
  const [language, setLanguage] = useState<Language>('vi')
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard')
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState(quizBank.title)

  useEffect(() => {
    if (appMode !== 'live') return

    let active = true
    void getCloudflareUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((error: unknown) => {
        if (active) setAuthError(error instanceof Error ? error.message : 'Không thể khôi phục phiên đăng nhập.')
      })
      .finally(() => {
        if (active) setIsCheckingSession(false)
      })

    return () => {
      active = false
    }
  }, [appMode])

  const value = useMemo(
    () => ({
      user,
      language,
      appMode,
      currentPage,
      quizScore,
      draftTitle,
      setUser: (nextUser: AppUser | null) => {
        if (!nextUser) {
          forgetDemoUser()
          if (appMode === 'live') {
            signOutFromCloudflare()
          }
        } else {
          setAuthError('')
        }
        setUser(nextUser)
        setCurrentPage('dashboard')
      },
      setLanguage,
      setCurrentPage,
      setQuizScore,
      setDraftTitle,
    }),
    [appMode, currentPage, draftTitle, language, quizScore, user],
  )

  if (isCheckingSession) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Đang kiểm tra phiên đăng nhập...</div>
  }

  if (!user) {
    return (
      <appStateContext.Provider value={value}>
        <AuthGate initialError={authError} />
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
