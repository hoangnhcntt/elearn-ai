import { useState } from 'react'
import type { FormEvent } from 'react'
import { BookOpenCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { authenticateDemoAccount, forgetDemoUser, rememberDemoUser } from '../lib/demoAuth'
import { defaultAppState, useAppState } from '../lib/appState'
import { Badge } from './ui'

export function AuthGate() {
  const { setUser } = useAppState()
  const [role, setRole] = useState<'teacher' | 'student'>('teacher')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const user = authenticateDemoAccount(role, username, password)
    if (!user) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
      return
    }

    try {
      if (rememberMe) rememberDemoUser(user)
      else forgetDemoUser()
    } catch {
      setError('Không thể lưu phiên đăng nhập trên trình duyệt này. Hãy tắt “Ghi nhớ đăng nhập” và thử lại.')
      return
    }

    setUser(user)
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 md:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-soft">
        <div className="grid min-h-[760px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-brand-500 via-blue-600 to-brand-700 p-8 text-white md:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">E</div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-blue-100">ELearn AI</p>
                <h1 className="text-4xl font-bold">Learn English Every Day.</h1>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                <Sparkles className="text-sky-100" size={24} />
                <div>
                  <p className="font-semibold">AI assignment generator</p>
                  <p className="text-sm text-blue-100">Create tailored quizzes in seconds.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                <BookOpenCheck className="text-sky-100" size={24} />
                <div>
                  <p className="font-semibold">Teacher & student workflows</p>
                  <p className="text-sm text-blue-100">Track progress, assignments, and scores.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                <ShieldCheck className="text-sky-100" size={24} />
                <div>
                  <p className="font-semibold">Secure roles & RLS-ready database</p>
                  <p className="text-sm text-blue-100">Protect student data and limit access by role.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
              <Badge label="Đăng nhập demo" tone="blue" />
              <h2 className="mt-6 text-3xl font-bold text-slate-900">Chào mừng trở lại</h2>
              <p className="mt-2 text-sm text-slate-500">Đăng nhập bằng tài khoản học sinh hoặc giáo viên.</p>

              <div className="mt-8 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${role === 'teacher' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  onClick={() => { setRole('teacher'); setError('') }}
                  aria-pressed={role === 'teacher'}
                >
                  Giáo viên
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${role === 'student' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  onClick={() => { setRole('student'); setError('') }}
                  aria-pressed={role === 'student'}
                >
                  Học sinh
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Tên đăng nhập</span>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={role === 'teacher' ? 'teacher.demo' : 'student.demo'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded accent-brand-500"
                  />
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
                {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3.5 text-left font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Đăng nhập
                </button>
                <p className="text-xs leading-relaxed text-slate-500">
                  Đây là bản demo: tài khoản mẫu dùng chung và không bảo vệ dữ liệu thật.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SignOutButton() {
  return <button type="button" onClick={() => defaultAppState.setUser(null)} className="text-sm text-slate-500">Đăng xuất</button>
}
