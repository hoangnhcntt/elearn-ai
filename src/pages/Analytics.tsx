import { DashboardLayout } from '../components/Layout'
import { Card, StatCard } from '../components/ui'
import { students } from '../data/mockData'

export function Analytics() {
  return (
    <DashboardLayout active="analytics" title="Learning Analytics">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Average score" value="87%" hint="+8%" />
          <StatCard title="Weekly growth" value="12%" hint="Strong trend" />
          <StatCard title="Needs support" value={String(students.filter((student) => student.progress < 70).length)} hint="3 learners" />
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
            <h3 className="text-xl font-semibold text-slate-900">Recommended actions</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• Add a speaking drill for 3 learners with low confidence.</li>
              <li>• Review writing structure for average performance groups.</li>
              <li>• Schedule a grammar review for beginner classes.</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
