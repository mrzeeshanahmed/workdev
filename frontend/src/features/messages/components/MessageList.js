import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMessages } from '../useMessages';
import styles from './MessageList.module.css';
export function MessageList({ conversationId, currentUserId }) {
    const { messages, loading, sendMessage } = useMessages(conversationId, currentUserId);
    const [text, setText] = useState('');
    // submit handler extracted for readability and easier testing
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text)
            return;
        try {
            await sendMessage(text);
            setText('');
        }
        catch (err) {
            // swallow send errors for now; UI can show toast in future
        }
    };
    return (_jsxs("div", { children: [loading && _jsx("div", { "data-testid": "loading", children: "Loading..." }), _jsx("ul", { "data-testid": "messages", children: messages.map((m) => (_jsx("li", { "data-testid": `msg-${m.id}`, children: m.text }, m.id))) }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "message-input", className: styles.visuallyHidden, children: "Message" }), _jsx("input", { id: "message-input", "data-testid": "message-input", placeholder: "Write a message", value: text, onChange: (e) => setText(e.target.value) }), _jsx("button", { "data-testid": "send-btn", type: "submit", children: "Send" })] })] }));
}
