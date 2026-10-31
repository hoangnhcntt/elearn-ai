import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const wrangler = join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js')

function parseCsvRow(line) {
  const values = []
  let value = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"' && quoted && line[index + 1] === '"') {
      value += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      values.push(value)
      value = ''
    } else {
      value += character
    }
  }
  if (quoted) throw new Error('CSV chứa trường chưa đóng dấu ngoặc kép.')
  values.push(value)
  return values
}

async function readAccounts(file, role, pepper) {
  const text = await readFile(join(root, 'accounts', file), 'utf8')
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim())
  const headers = parseCsvRow(lines.shift() ?? '').map((header) => header.trim().toLowerCase())
  const indexes = Object.fromEntries(headers.map((header, index) => [header, index]))
  if (['name', 'username', 'password'].some((key) => indexes[key] === undefined)) {
    throw new Error(`${file} cần có các cột name,username,password.`)
  }

  return lines.map((line, index) => {
    const columns = parseCsvRow(line)
    const name = columns[indexes.name]?.trim()
    const username = columns[indexes.username]?.trim().toLowerCase()
    const password = columns[indexes.password] ?? ''
    if (!name || name.length > 120 || !username || !/^[a-z0-9._-]{1,64}$/.test(username)) {
      throw new Error(`${file} dòng ${index + 2} có name hoặc username không hợp lệ.`)
    }
    if (password.length < 8 || password.length > 256) {
      throw new Error(`${file} dòng ${index + 2} cần mật khẩu dài từ 8 đến 256 ký tự.`)
    }

    const salt = randomBytes(16)
    const passwordHash = pbkdf2Sync(`${pepper}:${password}`, salt, 10_000, 32, 'sha256')
    return {
      role,
      username,
      name,
      salt: salt.toString('base64url'),
      passwordHash: passwordHash.toString('base64url'),
    }
  })
}

function runWrangler(args) {
  const result = spawnSync(process.execPath, [wrangler, ...args], { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`wrangler ${args[0]} failed with exit code ${result.status}.`)
}

const pepper = randomBytes(32).toString('base64url')
const accounts = [
  ...await readAccounts('students.csv', 'student', pepper),
  ...await readAccounts('teachers.csv', 'teacher', pepper),
]
const uniqueAccounts = new Set(accounts.map((account) => `${account.role}:${account.username}`))
if (uniqueAccounts.size !== accounts.length) throw new Error('Có tên đăng nhập trùng trong cùng vai trò.')
if (accounts.length === 0) throw new Error('Không tìm thấy tài khoản nào trong hai file CSV.')

const secretsDirectory = await mkdtemp(join(tmpdir(), 'elearn-ai-auth-'))
const secretsFile = join(secretsDirectory, 'secrets.json')
try {
  await writeFile(secretsFile, JSON.stringify({
    AUTH_ACCOUNTS: JSON.stringify(accounts),
    AUTH_PEPPER: pepper,
    AUTH_SIGNING_KEY: randomBytes(32).toString('base64url'),
  }), { encoding: 'utf8', mode: 0o600 })
  await chmod(secretsFile, 0o600)

  console.log(`Deploying Worker with ${accounts.length} account(s); password values are hashed before upload.`)
  runWrangler(['deploy'])
  runWrangler(['secret', 'bulk', secretsFile])
  console.log('Worker authentication secrets updated. Only salted password hashes, a pepper, and a signing key were uploaded.')
} finally {
  await rm(secretsDirectory, { recursive: true, force: true })
}
