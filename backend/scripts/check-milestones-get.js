(async ()=>{
  const fetch = (...args) => import('node-fetch').then(m => m.default(...args))
  try {
    const r = await fetch('http://localhost:4000/api/workspaces/00000000-0000-0000-0000-000000000000/milestones')
    console.log('status', r.status)
    const text = await r.text()
    console.log('body:', text)
  } catch (err) {
    console.error('err', err)
  }
})()
