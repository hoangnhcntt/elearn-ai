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
    const prompt = input.trim()
    if (!prompt) return

    const normalizedPrompt = prompt.toLowerCase()
    const reply = normalizedPrompt.includes('make') || normalizedPrompt.includes('do')
      ? 'Use “do” for tasks and activities (do homework, do the dishes). Use “make” when creating something (make a plan, make dinner).'
      : normalizedPrompt.includes('past') || normalizedPrompt.includes('yesterday')
        ? 'For a completed action in the past, use the past simple: “I studied yesterday.” Some verbs are irregular, such as “go → went.”'
        : normalizedPrompt.includes('vocabulary') || normalizedPrompt.includes('word')
          ? 'Try learning a new word in a short sentence. For example: “The journey was exciting.” What word would you like to practice?'
          : 'Good question! Try writing one example sentence. I can help you practice grammar, vocabulary, and everyday English in this demo.'

    setMessages((prev) => [...prev, { role: 'student', text: prompt }, { role: 'assistant', text: reply }])
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
              <p className="text-xs text-slate-500">English practice · demo tutor</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-2xl p-3 ${message.role === 'assistant' ? 'bg-slate-100 text-slate-700' : 'ml-auto bg-brand-500 text-white'}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="mt-5 flex gap-3" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
              aria-label="Ask the English tutor"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim()} className="rounded-xl bg-brand-500 p-3 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
              <SendHorizonal size={18} />
            </button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
