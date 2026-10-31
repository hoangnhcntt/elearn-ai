import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Activity,
  Bell,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react'
import type { AppPage } from '../lib/appState'
import { useAppState } from '../lib/appState'

function SidebarNav({
  active,
  isTeacher,
  onNavigate,
}: {
  active: string
  isTeacher: boolean
  onNavigate: (page: AppPage) => void
}) {
  const items = isTeacher
    ? [
        { key: 'dashboard', label: 'Dashboard', page: 'dashboard' as const, icon: LayoutDashboard },
        { key: 'classes', label: 'Classes', page: 'classes' as const, icon: BookOpen },
        { key: 'students', label: 'Students', page: 'students' as const, icon: Users },
        { key: 'assignments', label: 'Assignments', page: 'assignments' as const, icon: ClipboardList },
        { key: 'ai-tutor', label: 'AI Tutor', page: 'ai-tutor' as const, icon: Sparkles },
        { key: 'analytics', label: 'Analytics', page: 'analytics' as const, icon: Activity },
      ]
    : [
        { key: 'dashboard', label: 'Dashboard', page: 'dashboard' as const, icon: LayoutDashboard },
        { key: 'assignments', label: 'Assignments', page: 'assignments' as const, icon: ClipboardList },
        { key: 'progress', label: 'Progress', page: 'progress' as const, icon: Activity },
        { key: 'ai-tutor', label: 'AI Tutor', page: 'ai-tutor' as const, icon: Sparkles },
        { key: 'settings', label: 'Settings', page: 'settings' as const, icon: Settings },
      ]

  return (
    <aside className="w-full border-b border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">E</div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">ELearn AI</p>
          <h1 className="text-lg font-semibold text-slate-900">Learn English Every Day</h1>
        </div>
      </div>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.page)}
            aria-current={active === item.key ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:w-full ${
              active === item.key ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-white hover:text-brand-600'
            }`}
          >
            <item.icon size={17} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-5 hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-soft lg:block lg:mt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Smart plan</p>
        <p className="mt-2 text-sm">Daily review set for speaking & grammar.</p>
      </div>
    </aside>
  )
}

export function DashboardLayout({ children, active, title }: { children: ReactNode; active: string; title: string }) {
  const { user, setUser, language, setLanguage, setCurrentPage } = useAppState()
  const [showNotifications, setShowNotifications] = useState(false)

  const isTeacher = user?.role === 'teacher'

  const statusBadge = useMemo(
    () => (isTeacher ? 'Teacher Workspace' : 'Student Workspace'),
    [isTeacher],
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <SidebarNav active={active} isTeacher={Boolean(isTeacher)} onNavigate={setCurrentPage} />
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{statusBadge}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <div className="relative">
                <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((shown) => !shown)}>
                  <Bell size={18} />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                    <p className="font-semibold text-slate-900">Notifications</p>
                    <p className="mt-3 text-sm text-slate-600">
                      {isTeacher ? 'You have assignments and student progress to review.' : 'Your next practice activity is ready.'}
                    </p>
                    <button type="button" className="mt-3 text-sm font-medium text-brand-600" onClick={() => { setShowNotifications(false); setCurrentPage('assignments') }}>
                      View assignments
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label="Messages — open AI Tutor" onClick={() => setCurrentPage('ai-tutor')}>
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
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label="Settings" onClick={() => setCurrentPage('settings')}>
                <Settings size={18} />
              </button>
              <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label="Logout" onClick={() => setUser(null)}>
                <LogOut size={18} />
              </button>
            </div>
          </header>
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
