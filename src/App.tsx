import { useMemo, useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { appStateContext } from './lib/appState'
import { Analytics } from './pages/Analytics'
import { AiTutor } from './pages/AiTutor'
import { ClassManagement } from './pages/ClassManagement'
import { QuizEditor } from './pages/QuizEditor'
import { QuizTaking } from './pages/QuizTaking'
import { ResultPage } from './pages/ResultPage'
import { StudentDashboard } from './pages/StudentDashboard'
import { TeacherDashboard } from './pages/TeacherDashboard'
import type { AppUser, Language } from './types'

function App() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [language, setLanguage] = useState<Language>('vi')

  const value = useMemo(
    () => ({
      user,
      language,
      appMode: 'mock' as const,
      setUser,
      setLanguage,
    }),
    [language, user],
  )

  if (!user) {
    return (
      <appStateContext.Provider value={value}>
        <AuthGate />
      </appStateContext.Provider>
    )
  }

  const isTeacher = user.role === 'teacher'

  return (
    <appStateContext.Provider value={value}>
      {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
      <div className="hidden">
        <ClassManagement />
        <QuizEditor />
        <QuizTaking />
        <ResultPage />
        <AiTutor />
        <Analytics />
      </div>
    </appStateContext.Provider>
  )
}

export default App
