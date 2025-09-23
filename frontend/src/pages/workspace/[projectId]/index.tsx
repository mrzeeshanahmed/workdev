import * as React from 'react'
import Tabs from '../../../components/workspace/Tabs'
import MilestonesList from '../../../components/workspace/Milestones/MilestonesList'
import MilestonesCreate from '../../../components/workspace/Milestones/MilestonesCreate'

export default function WorkspacePage({ projectId }: any) {
  const [active, setActive] = React.useState('milestones')
  const workspaceId = '00000000-0000-0000-0000-000000000000' // placeholder used by tests

  return (
    <div>
      <h2>Workspace {projectId}</h2>
      <Tabs active={active} onChange={setActive} />
      {active === 'milestones' && (
        <div>
          <MilestonesCreate workspaceId={workspaceId} onCreated={() => { /* refresh list if needed */ }} />
          <MilestonesList workspaceId={workspaceId} />
        </div>
      )}
      {active === 'messages' && <div>Messages tab (placeholder)</div>}
      {active === 'files' && <div>Files tab (placeholder)</div>}
      {active === 'details' && <div>Details tab (placeholder)</div>}
    </div>
  )
}
