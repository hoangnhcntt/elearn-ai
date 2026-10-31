import { createContext, useContext } from 'react'
import type { AppUser, Language } from '../types'

export type AppMode = 'mock' | 'live'

export type AppState = {
  user: AppUser | null
  language: Language
  appMode: AppMode
  setUser: (user: AppUser | null) => void
  setLanguage: (language: Language) => void
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
  appMode: (import.meta.env.VITE_APP_MODE as AppMode) || 'mock',
  setUser: () => undefined,
  setLanguage: () => undefined,
}
