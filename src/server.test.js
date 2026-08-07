import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

let baseUrl
let serverProcess

async function fetchUrl(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, { ...options, redirect: 'manual' })
  return {
    status: res.status,
    contentType: res.headers.get('content-type') || '',
    text: await res.text(),
  }
}

async function startServer() {
  const { spawn } = await import('child_process')
  const TEST_PORT = 19200 + Math.floor(Math.random() * 100)
  baseUrl = `http://127.0.0.1:${TEST_PORT}`
  return new Promise((resolve) => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: projectRoot,
      env: { ...process.env, PORT: String(TEST_PORT) },
      stdio: 'pipe',
    })
    serverProcess.stdout.on('data', (d) => {
      if (d.toString().includes('server_start')) resolve()
    })
    setTimeout(() => resolve(), 3000)
  })
}

describe('Server', () => {
  beforeAll(async () => {
    await startServer()
    await new Promise((r) => setTimeout(r, 500))
  })

  afterAll(() => {
    if (serverProcess) serverProcess.kill('SIGTERM')
  })

  it('serves root HTML', async () => {
    const res = await fetchUrl('/')
    expect(res.status).toBe(200)
    expect(res.contentType).toContain('text/html')
  })

  it('serves API as JSON', async () => {
    const res = await fetchUrl('/api/products.json')
    expect(res.status).toBe(200)
    expect(res.contentType).toContain('application/json')
  })

  it('returns JSON 404 for unknown API route', async () => {
    const res = await fetchUrl('/api/not-found')
    expect(res.status).toBe(404)
    expect(res.contentType).toContain('application/json')
  })

  it('returns 404 for missing static asset', async () => {
    const res = await fetchUrl('/missing.js')
    expect(res.status).toBe(404)
  })

  it('serves SPA fallback for deep routes', async () => {
    const res = await fetchUrl('/some/deep/route')
    expect(res.status).toBe(200)
    expect(res.contentType).toContain('text/html')
  })

  it('serves health/live endpoint', async () => {
    const res = await fetchUrl('/health/live')
    expect(res.status).toBe(200)
    expect(res.contentType).toContain('application/json')
    const data = JSON.parse(res.text)
    expect(data.status).toBe('live')
  })

  it('serves health/ready endpoint', async () => {
    const res = await fetchUrl('/health/ready')
    expect(res.status).toBe(200)
    const data = JSON.parse(res.text)
    expect(data.status).toBe('ready')
    expect(data.dist).toBe(true)
    expect(data.api).toBe(true)
  })

  it('serves aura.svg', async () => {
    const res = await fetchUrl('/aura.svg')
    expect(res.status).toBe(200)
  })
})
