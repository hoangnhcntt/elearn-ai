import { Activity, BookOpen, CalendarDays, GraduationCap } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { assignments, classes, students } from '../data/mockData'
import { DashboardLayout } from '../components/Layout'
import { Badge, Card, StatCard } from '../components/ui'
import { useAppState } from '../lib/appState'

const chartData = [
  { name: 'Jan', score: 62 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 76 },
  { name: 'Apr', score: 81 },
  { name: 'May', score: 88 },
  { name: 'Jun', score: 94 },
]

export function TeacherDashboard() {
  const { setCurrentPage } = useAppState()

  return (
    <DashboardLayout active="dashboard" title="Teacher Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-slate-900">Your learning workspace</p>
            <p className="mt-1 text-sm text-slate-500">Manage classes, review progress, and prepare assignments.</p>
          </div>
          <button type="button" onClick={() => setCurrentPage('assignments')} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            Create assignment
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total students" value={String(students.length)} hint="+12%" />
          <StatCard title="Total classes" value={String(classes.length)} hint="2 active" />
          <StatCard title="Assignments" value={String(assignments.length)} hint="7 due soon" />
          <StatCard title="Completion rate" value="84%" hint="Strong" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Learning trend</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Class performance</h3>
              </div>
              <Badge label="Upward" tone="green" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263d5a" />
                  <XAxis dataKey="name" stroke="#9aadc6" />
                  <YAxis stroke="#9aadc6" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#10233b', borderColor: '#263d5a', borderRadius: 12 }}
                    labelStyle={{ color: '#f1f6fd' }}
                    itemStyle={{ color: '#91bbff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-brand-600" size={20} />
              <h3 className="text-xl font-semibold text-slate-900">Students needing support</h3>
            </div>
            <div className="mt-4 space-y-4">
              {students.map((student) => (
                <button key={student.id} type="button" onClick={() => setCurrentPage('students')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-400">
                  <div>
                    <p className="font-medium text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.level} • {student.progress}% progress</p>
                  </div>
                  <Badge label={student.progress < 70 ? 'Needs help' : 'On track'} tone={student.progress < 70 ? 'amber' : 'green'} />
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">Class overview</h3>
            </div>
            <div className="mt-4 space-y-3">
              {classes.map((item) => (
                <button key={item.id} type="button" onClick={() => setCurrentPage('classes')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-400">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <Badge tone="blue" label={item.level} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.studentCount} students • {item.nextLesson}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">Assignments due soon</h3>
            </div>
            <div className="mt-4 space-y-3">
              {assignments.map((assignment) => (
                <button key={assignment.id} type="button" onClick={() => setCurrentPage('assignments')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-400">
                  <p className="font-medium text-slate-800">{assignment.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Due: {assignment.dueDate}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="text-brand-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-900">Weekly completion</h3>
            </div>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Mon', value: 64 }, { name: 'Tue', value: 78 }, { name: 'Wed', value: 81 }, { name: 'Thu', value: 69 }, { name: 'Fri', value: 88 }, { name: 'Sat', value: 92 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263d5a" />
                  <XAxis dataKey="name" stroke="#9aadc6" />
                  <YAxis stroke="#9aadc6" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#10233b', borderColor: '#263d5a', borderRadius: 12 }}
                    labelStyle={{ color: '#f1f6fd' }}
                    itemStyle={{ color: '#91bbff' }}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
