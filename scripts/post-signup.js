;(async () => {
  try {
    const res = await fetch('http://localhost:54324/functions/v1/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'x@example.com', password: 'p' }) })
    console.log('status', res.status)
    console.log(await res.text())
  } catch (err) { console.error('err', err && err.message) }
})()
