import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
export default function MilestonesCreate({ workspaceId, onCreated }) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [errors, setErrors] = React.useState([]);
    const [submitting, setSubmitting] = React.useState(false);
    async function submit(e) {
        e.preventDefault();
        // client-side validation
        const nextErrors = [];
        const titleTrim = title.trim();
        if (!titleTrim)
            nextErrors.push('Title is required');
        if (titleTrim.length > 140)
            nextErrors.push('Title must be 140 characters or less');
        if (description.length > 2000)
            nextErrors.push('Description must be 2000 characters or less');
        if (file) {
            // 10MB limit
            const maxBytes = 10 * 1024 * 1024;
            if (file.size > maxBytes)
                nextErrors.push('Attachment must be smaller than 10MB');
            // accept common types (images, pdf, text)
            const allowed = ['image/', 'application/pdf', 'text/'];
            if (!allowed.some(prefix => file.type.startsWith(prefix))) {
                nextErrors.push('Attachment type not supported');
            }
        }
        if (nextErrors.length) {
            setErrors(nextErrors);
            return;
        }
        setErrors([]);
        setSubmitting(true);
        const res = await fetch(`/api/workspaces/${workspaceId}/milestones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });
        if (res.status === 201) {
            const data = await res.json();
            onCreated?.(data);
            // if user selected a file, attempt to upload it to files endpoint (best-effort)
            if (file) {
                try {
                    const form = new FormData();
                    form.append('file', file);
                    await fetch(`/api/workspaces/${workspaceId}/files`, { method: 'POST', body: form });
                }
                catch (err) {
                    console.warn('file upload failed', err);
                }
            }
            setTitle('');
            setDescription('');
            setFile(null);
            setSubmitting(false);
        }
        else {
            // show a helpful message
            const text = await res.text().catch(() => null);
            alert(`Failed to create milestone${text ? `: ${text}` : ''}`);
            setSubmitting(false);
        }
    }
    function onFileChange(e) {
        const f = e.currentTarget.files && e.currentTarget.files.length ? e.currentTarget.files[0] : null;
        setFile(f);
    }
    return (_jsxs("form", { onSubmit: submit, children: [errors.length > 0 && (_jsx("div", { role: "alert", className: "milestone-errors", children: _jsx("ul", { children: errors.map((err, i) => (_jsx("li", { children: err }, i))) }) })), _jsxs("div", { children: [_jsx("label", { htmlFor: "milestone-title", children: "Title" }), _jsx("input", { id: "milestone-title", value: title, onChange: e => setTitle(e.currentTarget.value), placeholder: "e.g. Design mockups", maxLength: 140, required: true, disabled: submitting })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "milestone-description", children: "Description" }), _jsx("textarea", { id: "milestone-description", value: description, onChange: e => setDescription(e.currentTarget.value), placeholder: "Describe the milestone", maxLength: 2000, disabled: submitting })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "milestone-file", children: "Attachment (optional)" }), _jsx("input", { id: "milestone-file", type: "file", onChange: onFileChange, "aria-label": "Milestone attachment", disabled: submitting }), file && _jsxs("div", { className: "milestone-file-meta", children: [file.name, " (", Math.round(file.size / 1024), " KB)"] })] }), _jsx("button", { type: "submit", disabled: submitting, children: submitting ? 'Creating…' : 'Create Milestone' })] }));
}
