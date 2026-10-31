import { useState } from 'react'
import { DashboardLayout } from '../components/Layout'
import { Badge, Card } from '../components/ui'
import { quizBank } from '../data/mockData'

export function QuizEditor() {
  const [questions] = useState(quizBank.questions)

  return (
    <DashboardLayout active="assignments" title="Quiz Editor">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">AI generated</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{quizBank.title}</h3>
            </div>
            <Badge label={quizBank.level} tone="blue" />
          </div>
        </Card>

        <div className="space-y-4">
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
