import { DashboardLayout } from '../components/Layout'
import { Card, StatCard } from '../components/ui'
import { students } from '../data/mockData'
import { useAppState } from '../lib/appState'

export function Analytics() {
  const { user } = useAppState()
  const student = user?.role === 'student' ? user : null
  const isStudent = student !== null

  return (
    <DashboardLayout active={isStudent ? 'progress' : 'analytics'} title={isStudent ? 'My Progress' : 'Learning Analytics'}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title={isStudent ? 'Recent score' : 'Average score'} value={`${student?.lastScore ?? 87}%`} hint={isStudent ? 'Latest result' : '+8%'} />
          <StatCard title={isStudent ? 'My progress' : 'Weekly growth'} value={`${student?.progress ?? 12}%`} hint={isStudent ? 'Keep it up' : 'Strong trend'} />
          <StatCard title={isStudent ? 'Current level' : 'Needs support'} value={student?.level ?? String(students.filter((item) => item.progress < 70).length)} hint={isStudent ? 'Learning level' : 'Learners'} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-slate-900">Skill distribution</h3>
            <div className="mt-5 space-y-4">
              {[
                { label: 'Listening', value: 78 },
                { label: 'Reading', value: 83 },
                { label: 'Writing', value: 71 },
                { label: 'Speaking', value: 68 },
              ].map((skill) => (
                <div key={skill.label}>
                  <div className="mb-1 flex justify-between text-sm text-slate-600">
                    <span>{skill.label}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 rounded-full bg-brand-500" style={{ width: `${skill.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-slate-900">{isStudent ? 'Next steps' : 'Recommended actions'}</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              {isStudent ? (
                <>
                  <li>• Practice speaking with short daily prompts.</li>
                  <li>• Review grammar rules from recent quizzes.</li>
                  <li>• Keep a vocabulary journal for new words.</li>
                </>
              ) : (
                <>
                  <li>• Add a speaking drill for learners with low confidence.</li>
                  <li>• Review writing structure for average performance groups.</li>
                  <li>• Schedule a grammar review for beginner classes.</li>
                </>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
