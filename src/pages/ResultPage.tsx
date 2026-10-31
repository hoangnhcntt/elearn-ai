import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'
import { useAppState } from '../lib/appState'

export function ResultPage() {
  const { quizScore, setCurrentPage } = useAppState()
  const score = quizScore ?? 0

  return (
    <DashboardLayout active="assignments" title="Quiz results">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Final score</p>
          <h3 className="mt-4 text-5xl font-bold text-slate-900">{score}%</h3>
          <p className="mt-3 text-lg text-slate-600">
            {score >= 80 ? 'Excellent work — your performance is strong and improving.' : 'Good effort. Review the feedback and try again.'}
          </p>
        </Card>

        <Card className="p-6">
          <h4 className="text-xl font-semibold text-slate-900">Feedback</h4>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Vocabulary accuracy is strong.</li>
            <li>• Grammar control is improving.</li>
            <li>• Focus on speaking confidence for conversations.</li>
          </ul>
        </Card>
        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => setCurrentPage('dashboard')} className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
            Back to dashboard
          </button>
          <button type="button" onClick={() => setCurrentPage('quiz-taking')} className="rounded-2xl bg-brand-500 px-5 py-3 font-medium text-white transition hover:bg-brand-600">
            Try again
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
