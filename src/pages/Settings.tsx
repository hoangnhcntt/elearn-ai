import { LogOut, UserRound } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'
import { useAppState } from '../lib/appState'

export function SettingsPage() {
  const { user, setUser, language, setLanguage, appMode } = useAppState()

  return (
    <DashboardLayout active="settings" title="Settings">
      <div className="mx-auto max-w-3xl space-y-5">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <UserRound size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Account role</p>
            <p className="mt-1 capitalize text-slate-700">{user?.role}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900">Preferences</h3>
          <label className="mt-4 block max-w-sm">
            <span className="mb-2 block text-sm font-medium text-slate-700">Language preference</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'vi' | 'en')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </label>
          <p className="mt-2 text-xs text-slate-500">Saved for this session. Some demo content remains in English.</p>
        </Card>

        <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Application mode</h3>
            <p className="mt-1 text-sm text-slate-500">
              {appMode === 'mock' ? 'Demo data — changes are not saved to a database.' : 'Connected application'}
            </p>
          </div>
          <button type="button" onClick={() => setUser(null)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
