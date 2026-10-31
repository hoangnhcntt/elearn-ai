import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'
import { classes, students } from '../data/mockData'

export function ClassManagement() {
  return (
    <DashboardLayout active="classes" title="Class Management">
      <div className="grid gap-6 lg:grid-cols-2">
        {classes.map((schoolClass) => (
          <Card key={schoolClass.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Class</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{schoolClass.name}</h3>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{schoolClass.level}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Students</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{schoolClass.studentCount}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Next lesson</p>
                <p className="mt-2 text-sm text-slate-700">{schoolClass.nextLesson}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-700">Members</p>
              <div className="space-y-2">
                {students.filter((student) => student.classId === schoolClass.id).map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="font-medium text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    <span className="text-xs text-brand-600">{student.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
