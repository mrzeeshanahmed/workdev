import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/profiles.service';
export default function ProfilePage({ id }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getProfile(id).then((p) => { if (mounted)
            setProfile(p); }).finally(() => { if (mounted)
            setLoading(false); });
        return () => { mounted = false; };
    }, [id]);
    if (loading)
        return _jsx("div", { children: "Loading..." });
    if (!profile)
        return _jsx("div", { children: "Not found" });
    return (_jsxs("div", { children: [_jsx("h2", { children: profile.display_name || profile.full_name || profile.id }), _jsx("p", { children: profile.bio }), _jsxs("div", { children: ["Vetted: ", String(profile.is_vetted === true)] })] }));
}
