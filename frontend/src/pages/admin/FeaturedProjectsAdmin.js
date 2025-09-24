import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import '../../styles/marketplace.css';
export default function FeaturedProjectsAdmin() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        // fetch current featured projects (best-effort)
        fetch('/api/public/projects?featured=true')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setProjects(data.items || []))
            .catch(() => setProjects([]));
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { children: "Featured Projects (Admin)" }), _jsx("p", { children: "This is a minimal admin UI to mark/unmark featured projects. Implement server-side actions separately." }), _jsx("ul", { children: projects.map(p => (_jsxs("li", { className: "project-card", children: [_jsx("strong", { children: p.title }), _jsx("div", { children: _jsx("a", { href: `/projects/${p.id}`, children: "View" }) })] }, p.id))) })] }));
}
