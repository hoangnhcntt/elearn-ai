import { BookOpenCheck, BrainCircuit, CalendarCheck2, Target, Trophy } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Card, StatCard } from '../components/ui'
import { assignments, quizBank, students } from '../data/mockData'
import { useAppState } from '../lib/appState'

export function StudentDashboard() {
  const { user, setCurrentPage } = useAppState()
  const currentStudent = user?.role === 'student' ? user : students[0]
  const studentAssignments = assignments.filter((assignment) => assignment.classId === currentStudent.classId)

  return (
    <DashboardLayout active="dashboard" title="Student Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Welcome back</p>
            <h3 className="mt-2 text-3xl font-semibold">Hi {currentStudent.name}!</h3>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-blue-100">Current level</p>
            <p className="text-xl font-semibold">{currentStudent.level}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Today's tasks" value={String(studentAssignments.length)} hint="Ready to practice" />
          <StatCard title="Unfinished" value={String(studentAssignments.filter((assignment) => assignment.status === 'in_progress' || assignment.status === 'not_started').length)} hint="Keep going" />
          <StatCard title="Recent score" value={`${currentStudent.lastScore}%`} hint="Latest result" />
          <StatCard title="Progress" value={`${currentStudent.progress}%`} hint="Learning progress" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Target className="text-brand-600" size={18} />
              <h3 className="text-xl font-semibold text-slate-900">Assignments</h3>
            </div>
            <div className="mt-4 space-y-3">
              {studentAssignments.map((assignment) => (
                <button key={assignment.id} type="button" onClick={() => setCurrentPage('assignments')} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-400">
                  <div>
                    <p className="font-medium text-slate-900">{assignment.title}</p>
                    <p className="text-sm text-slate-500">Due {assignment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{assignment.completionRate}%</p>
                    <p className="text-xs text-brand-600">{assignment.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-brand-600" size={18} />
              <h3 className="text-xl font-semibold text-slate-900">Skills improvement</h3>
            </div>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Grammar', value: 74 },
                { label: 'Vocabulary', value: 82 },
                { label: 'Speaking', value: 67 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200">
                    <div className="h-2.5 rounded-full bg-brand-500" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">Quiz preview</h3>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-500">{quizBank.title}</p>
              <p className="text-2xl font-semibold text-slate-900">{quizBank.questionCount} questions</p>
              <p className="text-sm text-slate-500">{quizBank.timeLimitMinutes} minutes</p>
              <button type="button" onClick={() => setCurrentPage('assignments')} className="mt-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
                Start practice
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">History</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>• 5 recent activities</p>
              <p>• 2 writing tasks reviewed</p>
              <p>• 1 speaking practice scheduled</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">Strengths</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>• Strong vocabulary recall</p>
              <p>• Accurate everyday phrases</p>
              <p>• Good reading comprehension</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
