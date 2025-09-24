"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
exports.ProjectModel = {
    async findById(db, id) {
        const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
        return rows[0] || null;
    },
    async list(db, opts = {}) {
        const limit = opts.limit || 20;
        const offset = opts.offset || 0;
        const { rows } = await db.query('SELECT * FROM projects WHERE is_public = true ORDER BY featured DESC, featured_at DESC, created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return rows;
    }
};
// end
