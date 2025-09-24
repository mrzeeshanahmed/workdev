import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { updateProfile } from '../../services/profiles.service';
export default function OnboardingForm({ userId, initial }) {
    const [displayName, setDisplayName] = useState(initial?.display_name || '');
    const [fullName, setFullName] = useState(initial?.full_name || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            // create or update profile row for the signed-in user
            await updateProfile(userId, { display_name: displayName, full_name: fullName });
        }
        catch (err) {
            setError(err?.message || 'Failed');
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("form", { onSubmit: submit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "displayName", children: "Display name" }), _jsx("input", { id: "displayName", placeholder: "Display name", value: displayName, onChange: (e) => setDisplayName(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "fullName", children: "Full name" }), _jsx("input", { id: "fullName", placeholder: "Full name", value: fullName, onChange: (e) => setFullName(e.target.value) })] }), error && _jsx("div", { role: "alert", children: error }), _jsx("button", { type: "submit", disabled: saving, children: saving ? 'Saving...' : 'Save' })] }));
}
