import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'

export function ResultPage() {
  return (
    <DashboardLayout active="dashboard" title="Result Page">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Final score</p>
          <h3 className="mt-4 text-5xl font-bold text-slate-900">86%</h3>
          <p className="mt-3 text-lg text-slate-600">Excellent work — your performance is strong and improving.</p>
        </Card>

        <Card className="p-6">
          <h4 className="text-xl font-semibold text-slate-900">Feedback</h4>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Vocabulary accuracy is strong.</li>
            <li>• Grammar control is improving.</li>
            <li>• Focus on speaking confidence for conversations.</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
