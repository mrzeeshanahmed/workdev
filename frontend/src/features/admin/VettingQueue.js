import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { listProfiles, toggleVetting } from '../../services/profiles.service';
export default function VettingQueue() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        listProfiles().then((p) => { if (mounted)
            setProfiles(p); }).finally(() => { if (mounted)
            setLoading(false); });
        return () => { mounted = false; };
    }, []);
    async function toggle(id, current) {
        try {
            const updated = await toggleVetting(id, !current);
            setProfiles((s) => s.map((p) => (p.id === id ? updated : p)));
        }
        catch (err) {
            // noop for now
        }
    }
    if (loading)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("div", { children: [_jsx("h3", { children: "Vetting Queue" }), _jsx("ul", { children: profiles.map((p) => (_jsxs("li", { children: [_jsx("span", { children: p.display_name || p.full_name || p.id }), _jsx("button", { onClick: () => toggle(p.id, p.is_vetted), children: p.is_vetted ? 'Unvet' : 'Vet' })] }, p.id))) })] }));
}
