// Central in-memory stores for tests / MVP
export const developers = new Map()
export const projects = new Map()
export const proposals = new Map()
export const savedSearches = new Map()
export const analytics = new Map()

export const workspaces = new Map()
export const milestones = new Map()
export const files = new Map()
export const notifications = new Map()
export const messages = new Map()

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
  owner_id: 'client-1',
  title: 'Build API',
  description: 'Need a Node API',
  skills: ['node', 'express'],
  project_type: 'fixed',
  budget_min: 1000,
  budget_max: 5000,
})

// seed a sample workspace id used by tests (optional)
const sampleWorkspaceId = '00000000-0000-0000-0000-000000000000'
workspaces.set(sampleWorkspaceId, {
  id: sampleWorkspaceId,
  project_id: sampleProjectId,
  client_id: 'client-1',
  developer_id: 'dev-1',
  status: 'active',
  created_at: new Date().toISOString(),
})

// sample notification store empty by default

export default {
  developers,
  projects,
  proposals,
  savedSearches,
  analytics,
  workspaces,
  milestones,
  files,
  messages,
  notifications,
}
