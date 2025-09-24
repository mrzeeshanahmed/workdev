import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getReputation } from '../../services/reviews.service';
export default function ReputationDisplay({ profileId, pollIntervalMs = 5000, reloadKey = 0 }) {
    const [rep, setRep] = useState(null);
    const [loading, setLoading] = useState(true);
    async function fetchRep() {
        try {
            const r = await getReputation(profileId);
            setRep(r);
        }
        catch (e) {
            // noop
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        // fetch immediately when profileId or reloadKey changes
        fetchRep();
        const id = setInterval(fetchRep, pollIntervalMs);
        return () => clearInterval(id);
    }, [profileId, pollIntervalMs, reloadKey]);
    if (loading)
        return _jsx("div", { children: "Loading reputation..." });
    if (!rep)
        return _jsx("div", { children: "No reputation" });
    return (_jsxs("div", { children: [_jsxs("div", { children: ["Average score: ", Number(rep.avg_score).toFixed(2)] }), _jsxs("div", { children: ["Reviews: ", rep.review_count] })] }));
}
