// Central in-memory stores for tests / MVP
export const developers = new Map()
export const projects = new Map()
export const proposals = new Map()
export const savedSearches = new Map()
export const analytics = new Map()

// Seed sample data used by tests
const sampleDeveloperId = 'dev-1'
developers.set(sampleDeveloperId, {
  id: sampleDeveloperId,
  user_id: 'user-1',
  display_name: 'Alice Dev',
  headline: 'Fullstack Developer',
  skills: ['javascript', 'node'],
  avatar_url: null,
})

const sampleProjectId = 'proj-1'
projects.set(sampleProjectId, {
  id: sampleProjectId,
  client_id: 'client-1',
  title: 'Build API',
  description: 'Need a Node API',
  required_skills: ['node', 'express'],
  project_type: 'fixed',
  budget_min: 1000,
  budget_max: 5000,
})

export default {
  developers,
  projects,
  proposals,
  savedSearches,
  analytics,
}
