"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperProfileModel = void 0;
exports.DeveloperProfileModel = {
    async findById(db, id) {
        const { rows } = await db.query('SELECT * FROM developer_profiles WHERE id = $1', [id]);
        return rows[0] || null;
    },
    async search(db, q, limit = 20) {
        const { rows } = await db.query("SELECT * FROM developer_profiles WHERE is_public = true AND (display_name ILIKE $1 OR headline ILIKE $1 OR bio ILIKE $1) LIMIT $2", [`%${q}%`, limit]);
        return rows;
    }
};
// end
