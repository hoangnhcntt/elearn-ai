import { useState } from 'react'
import { Bot, SendHorizonal, Sparkles } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Card } from '../components/ui'

export function AiTutor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help you improve grammar, vocabulary, and speaking confidence.' },
    { role: 'student', text: 'Can you explain the difference between “do” and “make”?' },
    { role: 'assistant', text: '“Do” is used for tasks, jobs, or actions; “make” is used for creating or producing something.' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'student', text: input }])
    setInput('')
  }

  return (
    <DashboardLayout active="ai-tutor" title="AI Tutor">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-600" size={18} />
            <h3 className="text-xl font-semibold text-slate-900">Support features</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Grammar explanation and examples</li>
            <li>• Vocabulary practice</li>
            <li>• Writing feedback and suggestions</li>
            <li>• Speaking prompts</li>
            <li>• Smart daily review</li>
          </ul>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Bot size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-900">ELearn AI Tutor</p>
              <p className="text-xs text-slate-500">Live English support</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-2xl p-3 ${message.role === 'assistant' ? 'bg-slate-100 text-slate-700' : 'ml-auto bg-brand-500 text-white'}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
            />
            <button type="button" onClick={sendMessage} className="rounded-xl bg-brand-500 p-3 text-white transition hover:bg-brand-600">
              <SendHorizonal size={18} />
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
