import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-2xl border border-slate-200 bg-white p-5 shadow-soft', className)}>{children}</div>
}

export function Badge({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
  }

  return <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', tones[tone])}>{label}</span>
}

export function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <span className="text-xs text-slate-500">{hint}</span>
      </div>
    </Card>
  )
}
