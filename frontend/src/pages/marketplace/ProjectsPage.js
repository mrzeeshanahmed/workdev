import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import FeaturedProjects from '../../components/marketplace/FeaturedProjects';
import ProjectCard from '../../components/marketplace/ProjectCard';
import '../../styles/marketplace.css';
const SAMPLE = [
    { id: 'p1', title: 'Small Widget', short_description: 'A tiny widget project', budget: { min: 100, max: 300, currency: 'USD' } },
    { id: 'p2', title: 'Large Platform', short_description: 'Enterprise platform build', budget: { min: 5000, max: 20000, currency: 'USD' } }
];
export default function ProjectsPage() {
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch('/api/public/projects');
                if (!res.ok)
                    throw new Error('Network response not ok');
                const data = await res.json();
                if (mounted)
                    setProjects(Array.isArray(data) ? data : data.items || []);
            }
            catch (err) {
                console.warn('Failed to fetch projects, falling back to sample', err);
                if (mounted) {
                    setError('Could not load live projects; showing samples');
                    setProjects(SAMPLE);
                }
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { children: "Projects" }), _jsx(FeaturedProjects, {}), _jsxs("div", { className: "marketpage-body", children: [_jsx("h2", { children: "All Projects" }), loading && _jsx("p", { className: "loading", children: "Loading projects\u2026" }), error && _jsx("p", { className: "loading", children: error }), projects && projects.map(p => (_jsx(ProjectCard, { id: p.id, title: p.title, short_description: p.short_description, budget: p.budget }, p.id)))] })] }));
}
