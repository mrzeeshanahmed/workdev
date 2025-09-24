import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function PostProjectWizard({ onSubmit, fetchImpl }) {
    const [step, setStep] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const fetcher = fetchImpl || fetch;
    function validateStep(s) {
        const e = {};
        if (s === 0) {
            if (!title.trim())
                e.title = 'Required';
            if (!description.trim())
                e.description = 'Required';
        }
        if (s === 1) {
            if (skills.length === 0)
                e.skills = 'Add at least one skill';
        }
        if (s === 2) {
            const min = parseInt(budgetMin || '0', 10) || 0;
            const max = parseInt(budgetMax || '0', 10) || 0;
            if (min && max && min > max)
                e.budget = 'Min must be <= Max';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }
    function next() {
        if (!validateStep(step))
            return;
        setStep(s => Math.min(2, s + 1));
    }
    function back() { setStep(s => Math.max(0, s - 1)); }
    function addSkill() {
        const v = skillInput.trim();
        if (!v)
            return;
        if (!skills.includes(v))
            setSkills(s => [...s, v]);
        setSkillInput('');
    }
    async function submit(e) {
        e && e.preventDefault();
        if (!validateStep(2))
            return;
        const payload = {
            title,
            description,
            budget_min: budgetMin ? parseInt(budgetMin, 10) : null,
            budget_max: budgetMax ? parseInt(budgetMax, 10) : null,
            skills
        };
        if (onSubmit)
            onSubmit(payload);
        try {
            const res = await fetcher('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok)
                throw new Error('network');
            // success handling could be more elaborate
            setStep(2);
        }
        catch (err) {
            setErrors({ submit: 'Failed to submit' });
        }
    }
    return (_jsx("div", { className: "max-w-xl mx-auto p-4", children: _jsxs("form", { "aria-label": "post-project-form", onSubmit: submit, className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `px-3 py-1 rounded ${step === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "1" }), _jsx("div", { className: `px-3 py-1 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "2" }), _jsx("div", { className: `px-3 py-1 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "3" })] }), step === 0 && (_jsxs("fieldset", { children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Title" }), _jsx("input", { "aria-label": "Title", value: title, onChange: e => setTitle(e.target.value), className: "mt-1 block w-full border rounded p-2" })] }), _jsxs("label", { className: "block mt-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Description" }), _jsx("textarea", { "aria-label": "Description", value: description, onChange: e => setDescription(e.target.value), className: "mt-1 block w-full border rounded p-2" })] }), errors.title && _jsx("div", { role: "alert", className: "text-red-600", children: errors.title }), errors.description && _jsx("div", { role: "alert", className: "text-red-600", children: errors.description })] })), step === 1 && (_jsxs("fieldset", { children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Skills" }), _jsxs("div", { className: "flex mt-1", children: [_jsx("input", { "aria-label": "Skill input", value: skillInput, onChange: e => setSkillInput(e.target.value), className: "flex-1 border rounded p-2" }), _jsx("button", { type: "button", onClick: addSkill, className: "ml-2 px-3 py-2 bg-blue-600 text-white rounded", children: "Add" })] })] }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: skills.map(s => _jsx("span", { className: "px-2 py-1 bg-gray-100 rounded", children: s }, s)) }), errors.skills && _jsx("div", { role: "alert", className: "text-red-600", children: errors.skills })] })), step === 2 && (_jsxs("fieldset", { children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Budget Min" }), _jsx("input", { "aria-label": "Budget Min", value: budgetMin, onChange: e => setBudgetMin(e.target.value), className: "mt-1 block w-full border rounded p-2" })] }), _jsxs("label", { className: "block mt-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Budget Max" }), _jsx("input", { "aria-label": "Budget Max", value: budgetMax, onChange: e => setBudgetMax(e.target.value), className: "mt-1 block w-full border rounded p-2" })] }), _jsxs("div", { className: "mt-3", children: [_jsx("h4", { className: "font-medium", children: "Review" }), _jsxs("div", { children: ["Title: ", title] }), _jsxs("div", { children: ["Description: ", description] }), _jsxs("div", { children: ["Skills: ", skills.join(', ')] }), _jsxs("div", { children: ["Budget: ", budgetMin, " - ", budgetMax] })] }), errors.budget && _jsx("div", { role: "alert", className: "text-red-600", children: errors.budget }), errors.submit && _jsx("div", { role: "alert", className: "text-red-600", children: errors.submit })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("div", { children: step > 0 && _jsx("button", { type: "button", onClick: back, className: "px-3 py-2 bg-gray-200 rounded", children: "Back" }) }), _jsxs("div", { className: "space-x-2", children: [step < 2 && _jsx("button", { type: "button", onClick: next, className: "px-3 py-2 bg-blue-600 text-white rounded", children: "Next" }), step === 2 && _jsx("button", { type: "submit", className: "px-3 py-2 bg-green-600 text-white rounded", children: "Post Project" })] })] })] }) }));
}
