const fetch = require('node-fetch')

async function run() {
  const url = process.env.FUNCTION_URL || 'http://localhost:54321/reputation/refresh'
  const secret = process.env.REPUTATION_ADMIN_SECRET || ''
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'x-admin-secret': secret, 'content-type': 'application/json' } })
    console.log('status', res.status)
    console.log(await res.text())
  } catch (e) {
    console.error('err', e.message)
  }
}

run()
