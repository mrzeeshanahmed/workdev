import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReputationDisplay from './ReputationDisplay';
export default function ReviewsPage({ projectId, revieweeId }) {
    const pid = projectId || (window.location.pathname.replace('/reviews/', '') || 'proj-1');
    const reviewee = revieweeId || `p-${pid}`;
    const [refreshKey, setRefreshKey] = useState(0);
    return (_jsxs("div", { children: [_jsxs("h2", { children: ["Reviews for ", pid] }), _jsx(ReputationDisplay, { profileId: reviewee, reloadKey: refreshKey }), _jsx(ReviewForm, { projectId: pid, reviewerId: 'test-user', onSubmitted: () => { setRefreshKey((k) => k + 1); } })] }));
}
