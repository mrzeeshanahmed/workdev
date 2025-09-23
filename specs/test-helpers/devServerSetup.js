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
  // If a serverProcess handle already exists in this process, reuse it
  if (serverProcess) return { baseUrl: BASE_URL }

  // If a state file exists from a previous run, see if that server is still healthy
  if (fs.existsSync(STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
      if (data && data.baseUrl) {
        // Try to contact existing server before deciding to start a new one
        try {
          const res = await fetch(data.baseUrl + '/api/health').catch(() => null)
          if (res) {
            process.env.CONTRACT_BASE_URL = data.baseUrl
            return { baseUrl: data.baseUrl, urlBase: data.baseUrl }
          }
        } catch (e) {
          // ignore and continue to start a fresh server
        }
      }
    } catch (e) {
      // malformed state file, ignore and start fresh
    }
  }

  // Always try contacting the default base URL first; if an external process is
  // already serving tests on that port, reuse it instead of spawning a new
  // process which would hit EADDRINUSE.
  try {
    const res = await fetch(BASE_URL + '/api/health').catch(() => null)
    if (res) {
      process.env.CONTRACT_BASE_URL = BASE_URL
      return { baseUrl: BASE_URL, urlBase: BASE_URL }
    }
  } catch (e) {
    // ignore and continue
  }

  // Spawn a backend server for tests
  serverProcess = spawn(process.execPath, ['src/server.js'], {
    cwd: BACKEND_DIR,
    env: Object.assign({}, process.env, { NODE_ENV: 'test', DATABASE_URL: '' }),
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  serverProcess.stdout.on('data', (d) => console.log(`[backend] ${d.toString()}`))
  serverProcess.stderr.on('data', (d) => console.error(`[backend:err] ${d.toString()}`))

  // Handle spawn errors (EADDRINUSE etc.) so the test process doesn't crash.
  serverProcess.on('error', async (err) => {
    console.error('[backend:err] server process error', err && err.code ? err.code : err)
    if (err && err.code === 'EADDRINUSE') {
      // If port already in use, try to reuse existing base URL if healthy.
      try {
        const res = await fetch(BASE_URL + '/api/health').catch(() => null)
        if (res) {
          process.env.CONTRACT_BASE_URL = BASE_URL
          return
        }
      } catch (e) {
        // ignore
      }
    }
  })

  // Wait for server to be responsive, but if spawn fails because port is in use
  // the waitForServer will attempt contacting the base URL and will resolve if
  // another process is already serving tests.
  await waitForServer()

  // write state file for teardown
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ pid: serverProcess.pid, baseUrl: BASE_URL }))
  } catch (e) {
    // best effort
  }

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
