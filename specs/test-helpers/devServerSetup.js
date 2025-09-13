const { spawn } = require('child_process')
const path = require('path')

let child = null

module.exports = undefined

exports.default = async function globalSetup() {
  // Start functions dev server
  const cwd = path.resolve(__dirname, '..', '..', 'functions')
  // If dev-server already running, don't spawn a second instance
  let fetch
  if (typeof global.fetch === 'function') {
    fetch = global.fetch
  } else {
    fetch = require('node-fetch')
  }
  const base = `http://127.0.0.1:${process.env.FUNCTIONS_PORT || '54323'}`
  try {
    const ping = await fetch(`${base}/functions/v1/health`, { timeout: 500 })
    if (ping.ok) {
      // Already running — return a teardown that does nothing
      return async function noopTeardown() {}
    }
  } catch (e) {
    // not running — spawn a new one
  }

  child = spawn(process.execPath, ['dev-server.js'], { cwd, env: { ...process.env, FUNCTIONS_PORT: process.env.FUNCTIONS_PORT || '54323' }, stdio: ['ignore', 'pipe', 'pipe'] })
  child.stdout.on('data', (d) => { process.stdout.write(`[functions] ${d}`) })
  child.stderr.on('data', (d) => { process.stderr.write(`[functions-err] ${d}`) })

  // wait for health endpoint
  const deadline = Date.now() + 5000
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${base}/functions/v1/health`)
      if (r.ok) break
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 200))
  }

  // return a teardown function for Vitest to call after tests
  return async function teardown() {
    if (child && !child.killed) {
      child.kill()
      child = null
    }
  }
}
