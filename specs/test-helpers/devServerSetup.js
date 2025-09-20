const { spawn } = require('child_process')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')

const BACKEND_DIR = path.resolve(__dirname, '../../backend')
const BASE_URL = 'http://localhost:4000'
const START_TIMEOUT = 20000
const STATE_FILE = path.resolve(__dirname, '.devserver.json')

let serverProcess = null

function waitForServer(timeout = START_TIMEOUT) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    let resolved = false

    // if server writes a listening message, resolve immediately
    const onStdout = (chunk) => {
      const s = chunk.toString().toLowerCase()
      if (s.includes('listening') || s.includes('api server listening') || s.includes('server listening')) {
        resolved = true
        cleanup()
        return resolve()
      }
    }

    function cleanup() {
      if (serverProcess && serverProcess.stdout && serverProcess.stdout.off) {
        serverProcess.stdout.off('data', onStdout)
      }
    }

    if (serverProcess && serverProcess.stdout && serverProcess.stdout.on) {
      serverProcess.stdout.on('data', onStdout)
    }

    const attempt = async () => {
      try {
        const res = await fetch(BASE_URL + '/api/health').catch(() => null)
        if (res) {
          resolved = true
          cleanup()
          return resolve()
        }
      } catch (e) {
        // ignore
      }
      if (resolved) return
      if (Date.now() - start > timeout) {
        cleanup()
        return reject(new Error('server did not start'))
      }
      setTimeout(attempt, 200)
    }
    attempt()
  })
}

async function startIfNeeded() {
  if (serverProcess) return { baseUrl: BASE_URL }

  serverProcess = spawn(process.execPath, ['src/server.js'], {
    cwd: BACKEND_DIR,
    env: Object.assign({}, process.env, { NODE_ENV: 'test', DATABASE_URL: '' }),
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  serverProcess.stdout.on('data', (d) => console.log(`[backend] ${d.toString()}`))
  serverProcess.stderr.on('data', (d) => console.error(`[backend:err] ${d.toString()}`))

  await waitForServer()

  // write state file for teardown
  fs.writeFileSync(STATE_FILE, JSON.stringify({ pid: serverProcess.pid, baseUrl: BASE_URL }))

  // expose CONTRACT_BASE_URL for tests that read env
  process.env.CONTRACT_BASE_URL = BASE_URL

  return { baseUrl: BASE_URL, urlBase: BASE_URL }
}

async function stop() {
  if (serverProcess && serverProcess.pid) {
    try {
      serverProcess.kill()
    } catch (e) {
      // ignore
    }
  } else if (fs.existsSync(STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
      if (data && data.pid) process.kill(data.pid)
    } catch (e) {
      // ignore
    }
  }
  if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE)
  serverProcess = null
}

// Vitest expects default export to be a function for globalSetup/globalTeardown
module.exports = async function globalSetup() {
  // start server
  const info = await startIfNeeded()
  // Vitest expects globalSetup to optionally return a teardown function.
  // Return a function that will be called to stop the server.
  return async function globalTeardown() {
    await stop()
  }
}

// Also expose named functions for direct imports
module.exports.startIfNeeded = startIfNeeded
module.exports.stop = stop
module.exports.STATE_FILE = STATE_FILE
// end of file
