import { useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Badge, Card } from '../components/ui'
import { classes, students } from '../data/mockData'

export function StudentsPage() {
  const [query, setQuery] = useState('')
  const filteredStudents = useMemo(
    () => students.filter((student) => `${student.name} ${student.email} ${student.level}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  )

  return (
    <DashboardLayout active="students" title="Students">
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-slate-500">Follow each learner's progress across your classes.</p>
            <p className="mt-1 text-sm font-medium text-slate-400">{filteredStudents.length} students</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:w-72">
            <Search size={17} className="text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none"
              aria-label="Search students"
            />
          </label>
        </div>

        {filteredStudents.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => {
              const schoolClass = classes.find((item) => item.id === student.classId)
              return (
                <Card key={student.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                        {student.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{student.name}</h3>
                        <p className="text-sm text-slate-500">{student.email}</p>
                      </div>
                    </div>
                    <Badge label={student.level} />
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Users size={15} />{schoolClass?.name ?? 'Unassigned'}</span>
                    <span className="font-medium text-slate-700">Score {student.lastScore}%</span>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>Learning progress</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${student.progress}%` }} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-slate-500">No students match that search.</Card>
        )}
      </div>
    </DashboardLayout>
  )
}
