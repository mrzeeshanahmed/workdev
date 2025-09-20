/* eslint-env jest */
const { createProject, listProjects, getProjectDetail } = require('../../src/controllers/projectsController')

describe('projectsController (unit)', ()=>{
  test('createProject fallback returns project with id', async ()=>{
    const p = await createProject({ title: 't1', description: 'd', skills: ['js'] })
    expect(p).toHaveProperty('id')
    expect(p.title).toBe('t1')
  })

  test('listProjects fallback returns items and total_count', async ()=>{
    const res = await listProjects({})
    expect(res).toHaveProperty('items')
    expect(res).toHaveProperty('total_count')
  })

  test('getProjectDetail returns null for unknown id', async ()=>{
    const p = await getProjectDetail('no-such-id')
    expect(p).toBeNull()
  })
})
