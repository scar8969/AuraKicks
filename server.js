/* eslint-disable no-console */
import express from 'express'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import path from 'path'
import { existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '8080', 10)
const rateLimiter = new Map()

if (!Number.isFinite(PORT) || PORT < 1 || PORT > 65535) {
  console.error('FATAL: PORT must be between 1 and 65535')
  process.exit(1)
}

const distDir = path.join(__dirname, 'dist')
const apiDir = path.join(__dirname, 'api')
const indexHtml = path.join(distDir, 'index.html')

if (!existsSync(indexHtml)) {
  console.error('FATAL: dist/index.html not found. Run "npm run build" first.')
  process.exit(1)
}
if (!existsSync(apiDir)) {
  console.error('FATAL: api/ directory not found.')
  process.exit(1)
}

app.use(helmet({ contentSecurityPolicy: false }))

app.use((req, res, next) => {
  res.set('X-Request-Id', req.headers['x-request-id'] || globalThis.crypto?.randomUUID?.() || '')
  const start = Date.now()
  res.on('finish', () => {
    console.log(
      JSON.stringify({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: Date.now() - start,
        ip: req.ip,
      })
    )
  })
  next()
})

app.get('/health/live', (_req, res) => res.json({ status: 'live' }))
app.get('/health/ready', (_req, res) => {
  res.json({ status: 'ready', dist: existsSync(indexHtml), api: existsSync(apiDir) })
})

app.use(
  '/api',
  (req, res, next) => {
    const now = Date.now()
    const ip = req.ip
    if (!rateLimiter.has(ip)) rateLimiter.set(ip, [])
    const timestamps = rateLimiter.get(ip).filter((t) => now - t < 60000)
    if (timestamps.length > 30) {
      return res.status(429).json({ error: 'Too many requests' })
    }
    timestamps.push(now)
    rateLimiter.set(ip, timestamps)
    next()
  },
  express.static(apiDir, {
    setHeaders: (res) => res.set('Content-Type', 'application/json; charset=utf-8'),
  })
)
app.get('/api/{*path}', (_req, res) => res.status(404).json({ error: 'Not found' }))

app.use(
  express.static(distDir, {
    setHeaders: (res, filepath) => {
      if (filepath.includes(path.sep + 'assets' + path.sep)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable')
      } else {
        res.set('Cache-Control', 'public, max-age=3600')
      }
    },
  })
)

app.get(/\.(js|css|svg|png|jpg|jpeg|webp|avif|ico|woff2?|map)$/, (_req, res) => {
  res.status(404).end()
})

app.get('{*path}', (_req, res) => {
  res.sendFile(indexHtml)
})

const server = app.listen(PORT, () => {
  console.log(JSON.stringify({ event: 'server_start', port: PORT }))
})

function shutdown(signal) {
  console.log(JSON.stringify({ event: 'shutdown', signal }))
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 10000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
