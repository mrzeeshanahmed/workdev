"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeveloperDetail = getDeveloperDetail;
const SAMPLE_DEV = {
    id: '33333333-3333-3333-3333-333333333333',
    display_name: 'Dev One',
    headline: 'Frontend',
    summary: 'Experienced frontend engineer',
    is_public: true
};
async function getDeveloperDetail(id, opts = {}) {
    if (!id)
        return null;
    const base = id === SAMPLE_DEV.id ? SAMPLE_DEV : { id, display_name: 'Dev ' + id };
    if (opts && opts.authenticated) {
        // Attach contact metadata for authenticated callers
        return { ...base, contact: { email: 'dev@example.com' } };
    }
    return base;
}
exports.default = { getDeveloperDetail };
