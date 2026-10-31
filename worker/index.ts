export interface Env {
  AI: { run: (model: string, input: { messages: { role: string; content: string }[] }) => Promise<unknown> }
  RATE_LIMIT?: number
  AUTH_ACCOUNTS?: string
  AUTH_PEPPER?: string
  AUTH_SIGNING_KEY?: string
  AUTH_ALLOWED_ORIGINS?: string
}

const rateLimit = 10
const authAttempts = new Map<string, { count: number; resetAt: number }>()

type AuthAccount = {
  username: string
  name: string
  role: 'teacher' | 'student'
  salt: string
  passwordHash: string
}

type SessionClaims = {
  sub: string
  username: string
  name: string
  role: 'teacher' | 'student'
  exp: number
}

function base64UrlEncode(value: Uint8Array | string) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function corsHeaders(request: Request, env: Env) {
  const origin = request.headers.get('origin')
  const allowedOrigins = (env.AUTH_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const headers = new Headers({ vary: 'Origin', 'cache-control': 'no-store' })
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('access-control-allow-origin', origin)
    headers.set('access-control-allow-methods', 'GET, POST, OPTIONS')
    headers.set('access-control-allow-headers', 'authorization, content-type')
    headers.set('access-control-max-age', '600')
  }
  return headers
}

function authJson(request: Request, env: Env, body: unknown, status = 200) {
  const headers = corsHeaders(request, env)
  headers.set('content-type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(body), { status, headers })
}

function readAccounts(env: Env): AuthAccount[] {
  if (!env.AUTH_ACCOUNTS) throw new Error('Tài khoản đăng nhập chưa được cấu hình trên máy chủ.')
  const accounts: unknown = JSON.parse(env.AUTH_ACCOUNTS)
  if (!Array.isArray(accounts)) throw new Error('Danh sách tài khoản trên máy chủ không hợp lệ.')
  return accounts as AuthAccount[]
}

async function createToken(claims: SessionClaims, secret: string) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64UrlEncode(JSON.stringify(claims))
  const signingInput = `${header}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput))
  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`
}

async function verifyToken(token: string, secret: string): Promise<SessionClaims | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, payload, signature] = parts
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlDecode(signature),
      new TextEncoder().encode(`${header}.${payload}`),
    )
    if (!valid) return null
    const claims: unknown = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)))
    if (!claims || typeof claims !== 'object') return null
    const session = claims as Partial<SessionClaims>
    if (typeof session.sub !== 'string'
      || typeof session.username !== 'string'
      || typeof session.name !== 'string'
      || (session.role !== 'teacher' && session.role !== 'student')
      || typeof session.exp !== 'number'
      || session.exp <= Date.now() / 1000) return null
    return session as SessionClaims
  } catch {
    return null
  }
}

async function verifyPassword(password: string, account: AuthAccount, pepper: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${pepper}:${password}`),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: base64UrlDecode(account.salt), iterations: 10_000 },
    key,
    256,
  )
  const actual = new Uint8Array(derived)
  const expected = base64UrlDecode(account.passwordHash)
  if (actual.length !== expected.length) return false
  let difference = 0
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index]
  return difference === 0
}

async function handleAuth(request: Request, env: Env, url: URL) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) })

  const origin = request.headers.get('origin')
  const allowedOrigins = (env.AUTH_ALLOWED_ORIGINS ?? '').split(',').map((item) => item.trim())
  if (origin && !allowedOrigins.includes(origin)) {
    return authJson(request, env, { error: 'Origin không được phép truy cập.' }, 403)
  }

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
    const now = Date.now()
    const attempt = authAttempts.get(ip)
    if (attempt && attempt.resetAt > now && attempt.count >= 10) {
      return authJson(request, env, { error: 'Bạn thử đăng nhập quá nhiều lần. Hãy đợi 15 phút rồi thử lại.' }, 429)
    }

    if (Number(request.headers.get('content-length') ?? 0) > 4096) {
      return authJson(request, env, { error: 'Yêu cầu đăng nhập quá lớn.' }, 413)
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return authJson(request, env, { error: 'Dữ liệu đăng nhập không hợp lệ.' }, 400)
    }
    if (!body || typeof body !== 'object') {
      return authJson(request, env, { error: 'Dữ liệu đăng nhập không hợp lệ.' }, 400)
    }

    const input = body as Record<string, unknown>
    if ((input.role !== 'teacher' && input.role !== 'student')
      || typeof input.username !== 'string'
      || typeof input.password !== 'string'
      || input.username.length > 64
      || input.password.length > 256) {
      return authJson(request, env, { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }, 400)
    }

    const username = input.username.trim().toLowerCase()
    const accounts = readAccounts(env)
    const account = accounts.find((item) => item.role === input.role && item.username === username)
    if (!env.AUTH_PEPPER || !env.AUTH_SIGNING_KEY) {
      return authJson(request, env, { error: 'Máy chủ chưa được cấu hình đầy đủ.' }, 503)
    }
    const passwordMatches = account ? await verifyPassword(input.password, account, env.AUTH_PEPPER) : false
    if (!account || !passwordMatches) {
      const current = authAttempts.get(ip)
      authAttempts.set(ip, {
        count: current && current.resetAt > now ? current.count + 1 : 1,
        resetAt: current && current.resetAt > now ? current.resetAt : now + 15 * 60 * 1000,
      })
      if (authAttempts.size > 2000) {
        for (const [key, value] of authAttempts) if (value.resetAt <= now) authAttempts.delete(key)
      }
      return authJson(request, env, { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }, 401)
    }

    authAttempts.delete(ip)
    const claims: SessionClaims = {
      sub: `${account.role}:${account.username}`,
      username: account.username,
      name: account.name,
      role: account.role,
      exp: Math.floor(now / 1000) + (input.rememberMe === true ? 30 : 1) * 24 * 60 * 60,
    }
    const token = await createToken(claims, env.AUTH_SIGNING_KEY)
    return authJson(request, env, {
      token,
      user: {
        id: claims.sub,
        name: account.name,
        role: account.role,
        email: `${account.username}@accounts.elearn-ai.invalid`,
      },
    })
  }

  if (url.pathname === '/api/auth/session' && request.method === 'GET') {
    if (!env.AUTH_SIGNING_KEY) {
      return authJson(request, env, { error: 'Máy chủ chưa được cấu hình khóa phiên đăng nhập.' }, 503)
    }
    const authorization = request.headers.get('authorization') ?? ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    const claims = await verifyToken(token, env.AUTH_SIGNING_KEY)
    if (!claims) return authJson(request, env, { error: 'Phiên đăng nhập đã hết hạn.' }, 401)
    return authJson(request, env, {
      user: {
        id: claims.sub,
        name: claims.name,
        role: claims.role,
        email: `${claims.username}@accounts.elearn-ai.invalid`,
      },
    })
  }

  return authJson(request, env, { error: 'Route not found' }, 404)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/auth/')) {
      return handleAuth(request, env, url)
    }

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
