(async ()=>{
  const fetch = (...args) => import('node-fetch').then(m => m.default(...args))
  try {
  const r = await fetch('http://localhost:3000/api/workspaces/00000000-0000-0000-0000-000000000000/milestones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Test MS', description: 'desc' }) })
    console.log('create status', r.status)
    const j = await r.json()
    console.log('create body', j)
    const id = j.milestoneId || j.id
  const s = await fetch(`http://localhost:3000/api/workspaces/00000000-0000-0000-0000-000000000000/milestones/${id}/submit`, { method: 'POST' })
    console.log('submit status', s.status)
    console.log('submit body', await s.json())
  } catch (err) {
    console.error('smoke err', err)
    process.exit(1)
  }
})()
