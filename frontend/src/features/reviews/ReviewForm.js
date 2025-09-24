import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createReview } from '../../services/reviews.service';
import supabase from '../../lib/supabaseClient';
export default function ReviewForm({ projectId, reviewerId, onSubmitted }) {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [localReviewer, setLocalReviewer] = useState(reviewerId);
    useEffect(() => {
        if (!reviewerId) {
            (async () => {
                try {
                    const s = await supabase.auth.getSession();
                    const uid = s.data?.session?.user?.id;
                    if (uid)
                        setLocalReviewer(uid);
                }
                catch (e) {
                    // noop
                }
            })();
        }
    }, [reviewerId]);
    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const rid = localReviewer || reviewerId;
            if (!rid)
                throw new Error('not-authenticated');
            await createReview({ project_id: projectId, reviewer_id: rid, reviewee_id: undefined, score, comment });
            setComment('');
            if (typeof onSubmitted === 'function')
                onSubmitted();
        }
        catch (err) {
            setError(err?.message || 'Failed');
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("form", { onSubmit: submit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "score", children: "Score" }), _jsx("input", { id: "score", type: "number", min: 1, max: 5, value: score, onChange: (e) => setScore(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "comment", children: "Comment" }), _jsx("textarea", { id: "comment", value: comment, onChange: (e) => setComment(e.target.value) })] }), error && _jsx("div", { role: "alert", children: error }), _jsx("button", { type: "submit", disabled: saving, children: saving ? 'Saving...' : 'Submit Review' })] }));
}
