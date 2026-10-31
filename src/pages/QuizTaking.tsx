import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'
import { quizBank } from '../data/mockData'
import { useAppState } from '../lib/appState'

export function QuizTaking() {
  const { draftTitle, setCurrentPage, setQuizScore, user } = useAppState()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const total = useMemo(() => quizBank.questions.length, [])

  const handleAnswerChange = (questionId: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }))
    setError('')
  }

  const submitQuiz = () => {
    if (Object.keys(answers).length !== total) {
      setError('Please answer every question before submitting.')
      return
    }

    const correctAnswers = quizBank.questions.filter((question) => answers[question.id] === question.answer).length
    setQuizScore(Math.round((correctAnswers / total) * 100))
    setCurrentPage('result')
  }

  return (
    <DashboardLayout active="assignments" title="Take a quiz">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Assignment</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{draftTitle || quizBank.title}</h3>
            </div>
            <div className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">{total} questions</div>
          </div>
        </Card>

        {quizBank.questions.map((question, index) => (
          <Card key={question.id} className="p-6">
            <p className="text-sm font-medium text-slate-500">Question {index + 1}</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{question.prompt}</p>
            <div className="mt-5 space-y-3">
              {question.choices?.map((choice) => (
                <label key={choice} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <input
                    type="radio"
                    name={question.id}
                    value={choice}
                    checked={answers[question.id] === choice}
                    onChange={() => handleAnswerChange(question.id, choice)}
                    className="h-4 w-4 accent-brand-500"
                  />
                  <span className="text-slate-700">{choice}</span>
                </label>
              ))}
            </div>
          </Card>
        ))}

        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button type="button" onClick={() => setCurrentPage(user?.role === 'teacher' ? 'assignments' : 'dashboard')} className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
          <button type="button" onClick={submitQuiz} className="rounded-2xl bg-brand-500 px-5 py-3 font-medium text-white transition hover:bg-brand-600">
            Submit quiz
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
