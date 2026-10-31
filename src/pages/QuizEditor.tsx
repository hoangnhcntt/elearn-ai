import { useState } from 'react'
import { DashboardLayout } from '../components/Layout'
import { Badge, Card } from '../components/ui'
import { quizBank } from '../data/mockData'
import { useAppState } from '../lib/appState'

export function QuizEditor() {
  const { draftTitle, setCurrentPage, setDraftTitle } = useAppState()
  const [questions] = useState(quizBank.questions)
  const [saved, setSaved] = useState(false)

  return (
    <DashboardLayout active="assignments" title="Quiz Editor">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Assignment draft</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Review and prepare a quiz</h3>
              </div>
              <Badge label="Demo mode" tone="blue" />
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">Assignment title</span>
                <input value={draftTitle} onChange={(event) => { setDraftTitle(event.target.value); setSaved(false) }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setCurrentPage('quiz-taking')} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Preview quiz
                </button>
                <button type="button" onClick={() => setSaved(true)} disabled={!draftTitle.trim()} className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
                  Save draft
                </button>
              </div>
            </div>
            {saved && <p role="status" className="text-sm text-green-700">Draft saved for this session. Demo data is not persisted.</p>}
          </div>
        </Card>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">{questions.length} questions · {quizBank.timeLimitMinutes} minutes · Level {quizBank.level}</p>
          </div>
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-900">Question {index + 1}</p>
                <Badge label={question.type} tone="green" />
              </div>
              <p className="mt-3 text-slate-700">{question.prompt}</p>
              <div className="mt-4 space-y-2">
                {question.choices?.map((choice) => (
                  <div key={choice} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {choice}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                Correct answer: {question.answer}
              </div>
              <div className="mt-3 text-sm text-slate-500">Explanation: {question.explanation}</div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
