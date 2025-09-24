"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDetail = getProjectDetail;
const SAMPLE_PROJECT = {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Featured Project',
    description: 'Full description of featured project',
    short_description: 'Short desc',
    project_type: 'fixed',
    budget_min: 500,
    budget_max: 2000,
    budget_currency: 'USD',
    featured: true
};
async function getProjectDetail(id) {
    if (!id)
        return null;
    // Return sample if id matches, otherwise return a basic object
    if (id === SAMPLE_PROJECT.id)
        return SAMPLE_PROJECT;
    return { id, title: 'Project ' + id };
}
exports.default = { getProjectDetail };
