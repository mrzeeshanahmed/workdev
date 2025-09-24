"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPublicProjects = listPublicProjects;
const SAMPLE_PROJECTS = [
    { id: '11111111-1111-1111-1111-111111111111', title: 'Featured Project', featured: true },
    { id: '22222222-2222-2222-2222-222222222222', title: 'Regular Project', featured: false }
];
async function listPublicProjects(_query = {}) {
    // Very simple filtering example (skills/budget not implemented yet)
    return { items: SAMPLE_PROJECTS, total_count: SAMPLE_PROJECTS.length, next_cursor: undefined };
}
exports.default = { listPublicProjects };
