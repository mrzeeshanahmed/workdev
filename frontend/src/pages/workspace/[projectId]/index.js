import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import Tabs from '../../../components/workspace/Tabs';
import MilestonesList from '../../../components/workspace/Milestones/MilestonesList';
import MilestonesCreate from '../../../components/workspace/Milestones/MilestonesCreate';
export default function WorkspacePage({ projectId }) {
    const [active, setActive] = React.useState('milestones');
    const workspaceId = '00000000-0000-0000-0000-000000000000'; // placeholder used by tests
    return (_jsxs("div", { children: [_jsxs("h2", { children: ["Workspace ", projectId] }), _jsx(Tabs, { active: active, onChange: setActive }), active === 'milestones' && (_jsxs("div", { children: [_jsx(MilestonesCreate, { workspaceId: workspaceId, onCreated: () => { } }), _jsx(MilestonesList, { workspaceId: workspaceId })] })), active === 'messages' && _jsx("div", { children: "Messages tab (placeholder)" }), active === 'files' && _jsx("div", { children: "Files tab (placeholder)" }), active === 'details' && _jsx("div", { children: "Details tab (placeholder)" })] }));
}
