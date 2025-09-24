import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
export default function Messages({ workspaceId }) {
    const [messages, setMessages] = React.useState([]);
    React.useEffect(() => {
        fetch(`/api/workspaces/${workspaceId}/messages`).then(r => r.json()).then(d => setMessages(d.messages || []));
    }, [workspaceId]);
    return (_jsxs("div", { children: [_jsx("h3", { children: "Messages" }), _jsx("ul", { children: messages.map((m) => (_jsxs("li", { children: [_jsx("strong", { children: m.author_id }), ": ", m.body, _jsx("div", { style: { fontSize: 12, color: '#666' }, children: m.created_at })] }, m.id))) })] }));
}
