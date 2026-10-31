import { students, teacherProfile } from '../data/mockData'
import type { AppUser, Role } from '../types'

const rememberedUserKey = 'elearn-ai-remembered-user'

const demoAccounts: Record<Role, { username: string; password: string; user: AppUser }> = {
  teacher: {
    username: 'teacher.demo',
    password: 'TeacherDemo-5vR9!xP3',
    user: teacherProfile,
  },
  student: {
    username: 'student.demo',
    password: 'StudentDemo-8hQ4!mK2',
    user: students[0],
  },
}

export const demoLoginCredentials: Record<Role, { username: string; password: string }> = {
  teacher: { username: demoAccounts.teacher.username, password: demoAccounts.teacher.password },
  student: { username: demoAccounts.student.username, password: demoAccounts.student.password },
}

export function authenticateDemoAccount(role: Role, username: string, password: string): AppUser | null {
  const account = demoAccounts[role]
  return username.trim().toLowerCase() === account.username && password === account.password
    ? account.user
    : null
}

export function getRememberedUser(): AppUser | null {
  let saved: string | null
  try {
    saved = window.localStorage.getItem(rememberedUserKey)
  } catch {
    return null
  }

  if (!saved) return null

  try {
    const parsed: unknown = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object' || !('id' in parsed) || !('role' in parsed)) {
      window.localStorage.removeItem(rememberedUserKey)
      return null
    }

    if (parsed.role === 'teacher' && parsed.id === teacherProfile.id) return teacherProfile
    if (parsed.role === 'student' && typeof parsed.id === 'string') {
      return students.find((student) => student.id === parsed.id) ?? null
    }

    window.localStorage.removeItem(rememberedUserKey)
    return null
  } catch {
    window.localStorage.removeItem(rememberedUserKey)
    return null
  }
}

export function rememberDemoUser(user: AppUser): void {
  window.localStorage.setItem(rememberedUserKey, JSON.stringify({ id: user.id, role: user.role }))
}

export function forgetDemoUser(): void {
  window.localStorage.removeItem(rememberedUserKey)
}
