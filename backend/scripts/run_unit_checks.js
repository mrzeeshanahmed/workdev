// Simple runtime checks for controllers used by unit tests
import path from 'path'

async function run() {
  try {
    const proposals = await import(path.join(process.cwd(), 'backend', 'src', 'controllers', 'proposalsController.js'))
    const projects = await import(path.join(process.cwd(), 'backend', 'src', 'controllers', 'projectsController.js'))

    console.log('Checking createProposal validation (expect error)')
    try {
      await proposals.createProposal('p1', null)
      console.error('ERROR: createProposal did not throw for null payload')
      process.exitCode = 2
      return
    } catch (e) {
      console.log('createProposal validation threw as expected:', e.message)
    }

    console.log('Checking createProposal fallback')
    const p = await proposals.createProposal('project-1', { cover_letter: 'hi', proposer_id: 'u1' })
    console.log('createProposal returned id:', p.id)

    console.log('Checking acceptProposal fallback')
    const accepted = await proposals.acceptProposal('project-1', 'prop-1', 'owner-1')
    console.log('acceptProposal returned status:', accepted.status)

    console.log('Checking createProject fallback')
    const pr = await projects.createProject({ title: 't1', description: 'd', skills: ['js'] })
    console.log('createProject id:', pr.id)

    console.log('Checking listProjects fallback')
    const list = await projects.listProjects({})
    console.log('listProjects items length:', Array.isArray(list.items) ? list.items.length : 'unknown')

    console.log('Checking getProjectDetail for missing id')
    const detail = await projects.getProjectDetail('no-such-id')
    console.log('getProjectDetail returned null?:', detail === null)

    console.log('All runtime checks passed')
  } catch (e) {
    console.error('Runtime check failed:', e)
    process.exitCode = 1
  }
}

run()
