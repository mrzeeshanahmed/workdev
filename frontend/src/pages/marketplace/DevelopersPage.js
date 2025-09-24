import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DeveloperCard from '../../components/marketplace/DeveloperCard';
const SAMPLE = [
    { id: 'd1', name: 'Ada Lovelace', headline: 'Backend Engineer', skills: ['python', 'systems'] },
    { id: 'd2', name: 'Grace Hopper', headline: 'Frontend Engineer', skills: ['javascript', 'accessibility'] }
];
export default function DevelopersPage() {
    const [devs, setDevs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch('/api/public/developers');
                if (!res.ok)
                    throw new Error('Network response not ok');
                const data = await res.json();
                if (mounted)
                    setDevs(Array.isArray(data) ? data : data.items || []);
            }
            catch (err) {
                console.warn('Failed to fetch developers, falling back to sample', err);
                if (mounted) {
                    setError('Could not load live developers; showing samples');
                    setDevs(SAMPLE);
                }
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { children: "Developers" }), loading && _jsx("p", { className: "loading", children: "Loading developers\u2026" }), error && _jsx("p", { className: "loading", children: error }), devs && devs.map(d => (_jsx(DeveloperCard, { id: d.id, name: d.name, headline: d.headline, skills: d.skills }, d.id)))] }));
}
