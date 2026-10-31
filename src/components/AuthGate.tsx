import { useMemo, useState } from 'react'
import { ArrowRight, BookOpenCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { teacherProfile, students } from '../data/mockData'
import { defaultAppState, useAppState } from '../lib/appState'
import { Badge } from './ui'

const teacherButton = 'teacher'
const studentButton = 'student'

export function AuthGate() {
  const { setUser } = useAppState()
  const [role, setRole] = useState<'teacher' | 'student'>('teacher')
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id ?? '')

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? students[0],
    [selectedStudentId],
  )

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
              <Badge label="Secure sign in" tone="blue" />
              <h2 className="mt-6 text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Choose a role to preview the platform in mock mode.</p>

              <div className="mt-8 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${role === teacherButton ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setRole('teacher')}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${role === studentButton ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setRole('student')}
                >
                  Student
                </button>
              </div>

              {role === 'teacher' ? (
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Teacher account</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{teacherProfile.name}</p>
                        <p className="text-sm text-slate-500">{teacherProfile.email}</p>
                      </div>
                      <Badge label="Teacher" tone="green" />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl bg-brand-500 px-4 py-4 text-left text-white transition hover:bg-brand-600"
                    onClick={() => setUser(teacherProfile)}
                  >
                    <span>Login as teacher</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Student account</span>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none ring-0"
                      value={selectedStudent?.id ?? ''}
                      onChange={(event) => setSelectedStudentId(event.target.value)}
                    >
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.level})
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Selected student</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{selectedStudent?.name}</p>
                    <p className="text-sm text-slate-500">{selectedStudent?.email}</p>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl bg-brand-500 px-4 py-4 text-left text-white transition hover:bg-brand-600"
                    onClick={() => setUser(selectedStudent ?? students[0])}
                  >
                    <span>Login as student</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SignOutButton() {
  return <button type="button" onClick={() => defaultAppState.setUser(null)} className="text-sm text-slate-500">Log out</button>
}
