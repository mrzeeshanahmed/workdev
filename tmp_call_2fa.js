const fetch = require('node-fetch')
(async()=>{
  try{
    const r = await fetch('http://localhost:54322/auth/2fa/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'test-user-1' }) })
    console.log('status', r.status)
    const t = await r.text()
    console.log('body:', t.slice(0, 400))
  }catch(e){
    console.error('err', e.message)
  }
})()
