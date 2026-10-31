export interface Env {
  AI: any
  RATE_LIMIT?: number
}

const rateLimit = 10

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'elearn-ai-worker', mode: 'mock-ready' })
    }

    if (url.pathname === '/api/ai/generate-quiz') {
      const contentType = request.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        return Response.json({ error: 'Unsupported content type' }, { status: 415 })
      }

      const body = await request.json().catch(() => null)
      if (!body || !body.level || !body.topic) {
        return Response.json({ error: 'Missing required fields: level, topic' }, { status: 400 })
      }

      const limit = Number(env.RATE_LIMIT ?? rateLimit)
      if (limit <= 0) {
        return Response.json({ error: 'AI rate limit is disabled or invalid' }, { status: 429 })
      }

      const model = '@cf/meta/llama-3.1-8b-instruct'
      const prompt = `Generate a JSON object with fields: level, topic, questions, and metadata. Keep it valid JSON only. Topic: ${body.topic}. Level: ${body.level}.` 

      try {
        const aiResponse = await env.AI.run(model, { messages: [{ role: 'user', content: prompt }] })
        return Response.json({ ok: true, model, result: aiResponse })
      } catch (error) {
        return Response.json({ error: 'AI service unavailable. Please retry later or continue with saved exercises.', details: (error as Error).message }, { status: 502 })
      }
    }

    return Response.json({ error: 'Route not found' }, { status: 404 })
  },
}
