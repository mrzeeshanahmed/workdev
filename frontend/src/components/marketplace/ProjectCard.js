import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../styles/marketplace.css';
export default function ProjectCard({ id, title, short_description, budget }) {
    return (_jsxs("article", { className: "project-card", children: [_jsx("h3", { children: title }), _jsx("p", { children: short_description }), budget && (_jsxs("p", { children: ["Budget: ", budget.min ?? 'N/A', " - ", budget.max ?? 'N/A', " ", budget.currency || ''] })), _jsx("a", { href: `/projects/${id}`, children: "View" })] }));
}
