"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPublicDevelopers = listPublicDevelopers;
const SAMPLE_DEVS = [
    { id: '33333333-3333-3333-3333-333333333333', user_id: 'user-3333', display_name: 'Dev One', headline: 'Frontend' }
];
async function listPublicDevelopers(_query = {}) {
    return { items: SAMPLE_DEVS, total_count: SAMPLE_DEVS.length, next_cursor: undefined };
}
exports.default = { listPublicDevelopers };
