"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillModel = void 0;
exports.SkillModel = {
    async findAll(db) {
        const { rows } = await db.query('SELECT id, name, slug, created_at FROM skills ORDER BY name');
        return rows;
    },
    async findById(db, id) {
        const { rows } = await db.query('SELECT id, name, slug, created_at FROM skills WHERE id = $1', [id]);
        return rows[0] || null;
    }
};
// end
