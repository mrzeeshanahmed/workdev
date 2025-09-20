const http = require('http')
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

const BASE = 'http://localhost:4000'

async function run() {
  const h = await (await fetch(BASE + '/health')).json()
  console.log('health', h)

  const pj = await (await fetch(BASE + '/api/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Smoke project', description: 'smoke', type: 'fixed', budget_min: 100 }) })).json()
  console.log('created project', pj)

  const list = await (await fetch(BASE + '/api/projects')).json()
  console.log('list.total', list.total)

  const prop = await (await fetch(`${BASE}/api/projects/${pj.id}/proposals`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ cover_letter: 'I can help', amount: 500 }) })).json()
  console.log('proposal created', prop)
}

run().catch(err => { console.error(err); process.exit(1) })
