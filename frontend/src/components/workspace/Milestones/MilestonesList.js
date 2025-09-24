import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
export default function MilestonesList({ workspaceId }) {
    const [list, setList] = React.useState([]);
    async function load() {
        const res = await fetch(`/api/workspaces/${workspaceId}/milestones`);
        const data = await res.json();
        setList(data.milestones || []);
    }
    React.useEffect(() => { load(); }, [workspaceId]);
    async function submit(id) {
        await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/submit`, { method: 'POST' });
        load();
    }
    async function approve(id) {
        await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/approve`, { method: 'POST' });
        load();
    }
    async function requestRevision(id) {
        const reason = prompt('Reason for revision:');
        if (!reason)
            return;
        await fetch(`/api/workspaces/${workspaceId}/milestones/${id}/request-revision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
        load();
    }
    async function edit(id) {
        const title = prompt('New title:');
        const description = prompt('New description:');
        if (!title && !description)
            return;
        await fetch(`/api/workspaces/${workspaceId}/milestones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) });
        load();
    }
    return (_jsxs("div", { children: [_jsx("h4", { children: "Milestones" }), _jsx("ul", { children: list.map((m) => (_jsxs("li", { style: { marginBottom: 12 }, children: [_jsxs("div", { children: [_jsx("strong", { children: m.title || m.title }), " \u2014 ", _jsx("em", { children: m.state })] }), _jsx("div", { style: { fontSize: 13, color: '#444' }, children: m.description }), _jsxs("div", { style: { marginTop: 6 }, children: [_jsx("button", { onClick: () => edit(m.id || m.milestoneId), style: { marginRight: 8 }, children: "Edit" }), _jsx("button", { onClick: () => submit(m.id || m.milestoneId), style: { marginRight: 8 }, children: "Submit" }), _jsx("button", { onClick: () => approve(m.id || m.milestoneId), style: { marginRight: 8 }, children: "Approve" }), _jsx("button", { onClick: () => requestRevision(m.id || m.milestoneId), children: "Request revision" })] }), m.history && m.history.length > 0 && (_jsxs("div", { style: { marginTop: 8, fontSize: 12, color: '#666' }, children: [_jsx("strong", { children: "History:" }), _jsx("ul", { children: m.history.map((h, i) => (_jsxs("li", { children: [h.action, " \u2014 ", h.at] }, i))) })] }))] }, m.id || m.milestoneId))) })] }));
}
