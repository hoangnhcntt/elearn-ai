import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { Bell, LogOut, MessageSquareText, Settings, Sparkles, UserRound } from 'lucide-react'
import { useAppState } from '../lib/appState'

function SidebarNav({ active, isTeacher }: { active: string; isTeacher: boolean }) {
  const items = isTeacher
    ? [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'classes', label: 'Classes' },
        { key: 'students', label: 'Students' },
        { key: 'assignments', label: 'Assignments' },
        { key: 'ai-tutor', label: 'AI Tutor' },
        { key: 'analytics', label: 'Analytics' },
      ]
    : [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'assignments', label: 'Assignments' },
        { key: 'progress', label: 'Progress' },
        { key: 'ai-tutor', label: 'AI Tutor' },
        { key: 'settings', label: 'Settings' },
      ]

  return (
    <aside className="w-full max-w-[260px] border-r border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">E</div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">ELearn AI</p>
          <h1 className="text-lg font-semibold text-slate-900">Learn English Every Day</h1>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
              active === item.key ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-white hover:text-brand-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Smart plan</p>
        <p className="mt-2 text-sm">Daily review set for speaking & grammar.</p>
      </div>
    </aside>
  )
}

export function DashboardLayout({ children, active, title }: { children: ReactNode; active: string; title: string }) {
  const { user, setUser, language, setLanguage } = useAppState()

  const isTeacher = user?.role === 'teacher'

  const statusBadge = useMemo(
    () => (isTeacher ? 'Teacher Workspace' : 'Student Workspace'),
    [isTeacher],
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <SidebarNav active={active} isTeacher={Boolean(isTeacher)} />
        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{statusBadge}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Messages">
                <MessageSquareText size={18} />
              </button>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  {isTeacher ? <UserRound size={16} /> : <Sparkles size={16} />}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
              </div>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Settings">
                <Settings size={18} />
              </button>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Logout" onClick={() => setUser(null)}>
                <LogOut size={18} />
              </button>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
