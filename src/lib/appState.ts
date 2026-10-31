import { createContext, useContext } from 'react'
import type { AppUser, Language } from '../types'

export type AppMode = 'mock' | 'live'
export type AppPage =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'assignments'
  | 'quiz-taking'
  | 'result'
  | 'progress'
  | 'ai-tutor'
  | 'analytics'
  | 'settings'

export type AppState = {
  user: AppUser | null
  language: Language
  appMode: AppMode
  currentPage: AppPage
  quizScore: number | null
  draftTitle: string
  setUser: (user: AppUser | null) => void
  setLanguage: (language: Language) => void
  setCurrentPage: (page: AppPage) => void
  setQuizScore: (score: number | null) => void
  setDraftTitle: (title: string) => void
}

export const appStateContext = createContext<AppState | null>(null)

export function useAppState() {
  const ctx = useContext(appStateContext)
  if (!ctx) {
    throw new Error('App state context is missing.')
  }
  return ctx
}

export const defaultAppState: AppState = {
  user: null,
  language: 'vi',
  appMode: import.meta.env.VITE_APP_MODE === 'mock' ? 'mock' : 'live',
  currentPage: 'dashboard',
  quizScore: null,
  draftTitle: '',
  setUser: () => undefined,
  setLanguage: () => undefined,
  setCurrentPage: () => undefined,
  setQuizScore: () => undefined,
  setDraftTitle: () => undefined,
}
