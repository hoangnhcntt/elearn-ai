import { students, teacherProfile } from '../data/mockData'
import type { AppUser, Role } from '../types'

const sessionKey = 'elearn-ai-auth-session'
const defaultAuthApiUrl = import.meta.env.VITE_AUTH_API_URL || 'https://elearn-ai-worker.nguyenhoang-272010.workers.dev'

type AuthResponse = {
  token: string
  user: {
    id: string
    name: string
    role: Role
    email: string
  }
}

function isAuthUser(value: unknown): value is AuthResponse['user'] {
  if (!value || typeof value !== 'object') return false
  const user = value as Record<string, unknown>
  return typeof user.id === 'string'
    && typeof user.name === 'string'
    && (user.role === 'teacher' || user.role === 'student')
    && typeof user.email === 'string'
}

function authApiUrl() {
  const url = defaultAuthApiUrl
  if (!url) throw new Error('Chưa cấu hình URL API đăng nhập của Cloudflare.')
  return url.replace(/\/+$/, '')
}

function toAppUser(user: AuthResponse['user']): AppUser {
  if (user.role === 'teacher') {
    return { ...teacherProfile, ...user, language: 'vi', role: 'teacher' }
  }
  return { ...students[0], ...user, language: 'vi', role: 'student' }
}

function storeSession(token: string, rememberMe: boolean) {
  if (rememberMe) {
    window.localStorage.setItem(sessionKey, token)
    window.sessionStorage.removeItem(sessionKey)
  } else {
    window.sessionStorage.setItem(sessionKey, token)
    window.localStorage.removeItem(sessionKey)
  }
}

function readSession() {
  const persistentToken = window.localStorage.getItem(sessionKey)
  if (persistentToken) return persistentToken
  return window.sessionStorage.getItem(sessionKey)
}

function clearSession() {
  window.localStorage.removeItem(sessionKey)
  window.sessionStorage.removeItem(sessionKey)
}

async function requestSession(token: string) {
  let response: Response
  try {
    response = await fetch(`${authApiUrl()}/api/auth/session`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error('Không kết nối được máy chủ đăng nhập. Vui lòng thử lại sau.')
  }

  const result: unknown = await response.json().catch(() => null)
  if (response.status === 401) return null
  if (!response.ok || !result || typeof result !== 'object') {
    const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
      ? result.error
      : 'Đã xảy ra lỗi khi kết nối máy chủ đăng nhập.'
    throw new Error(message)
  }
  return result as Record<string, unknown>
}

export async function signInWithCloudflare(
  role: Role,
  username: string,
  password: string,
  rememberMe: boolean,
): Promise<AppUser> {
  let response: Response
  try {
    response = await fetch(`${authApiUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role, username, password, rememberMe }),
    })
  } catch {
    throw new Error('Không kết nối được máy chủ đăng nhập. Vui lòng thử lại sau.')
  }

  const result: unknown = await response.json().catch(() => null)
  if (!response.ok || !result || typeof result !== 'object'
    || !('token' in result) || typeof result.token !== 'string'
    || !('user' in result) || !result.user || typeof result.user !== 'object'
    || !('id' in result.user) || typeof result.user.id !== 'string'
    || !('name' in result.user) || typeof result.user.name !== 'string'
    || !('role' in result.user) || (result.user.role !== 'teacher' && result.user.role !== 'student')
    || !('email' in result.user) || typeof result.user.email !== 'string') {
    const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
      ? result.error
      : 'Đã xảy ra lỗi khi đăng nhập.'
    throw new Error(message)
  }

  const authResponse = result as AuthResponse
  storeSession(authResponse.token, rememberMe)
  return toAppUser(authResponse.user)
}

export async function getCloudflareUser(): Promise<AppUser | null> {
  const token = readSession()
  if (!token) return null

  try {
    const result = await requestSession(token)
    if (!result || !isAuthUser(result.user)) {
      clearSession()
      return null
    }
    return toAppUser(result.user)
  } catch {
    throw new Error('Không kết nối được máy chủ đăng nhập. Vui lòng kiểm tra kết nối rồi thử lại.')
  }
}

export function signOutFromCloudflare() {
  clearSession()
}
