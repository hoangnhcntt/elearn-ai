import { BookOpenCheck, BrainCircuit, CalendarCheck2, Target, Trophy } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Card, StatCard } from '../components/ui'
import { assignments, quizBank, students } from '../data/mockData'

export function StudentDashboard() {
  const currentStudent = students[0]

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
          <StatCard title="Today's tasks" value="3" hint="1 due soon" />
          <StatCard title="Unfinished" value="2" hint="Keep going" />
          <StatCard title="Recent score" value="86%" hint="+7%" />
          <StatCard title="Progress" value="78%" hint="Strong" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Target className="text-brand-600" size={18} />
              <h3 className="text-xl font-semibold text-slate-900">Assignments</h3>
            </div>
            <div className="mt-4 space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{assignment.title}</p>
                    <p className="text-sm text-slate-500">Due {assignment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{assignment.completionRate}%</p>
                    <p className="text-xs text-brand-600">{assignment.status}</p>
                  </div>
                </div>
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
