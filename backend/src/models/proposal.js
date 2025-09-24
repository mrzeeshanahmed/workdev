"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalModel = void 0;
exports.ProposalModel = {
    async create(db, payload) {
        const { rows } = await db.query(`INSERT INTO proposals (project_id, applicant_id, cover_letter, amount, hours_estimate, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [payload.project_id, payload.applicant_id || null, payload.cover_letter, payload.amount || null, payload.hours_estimate || null, payload.status || 'submitted']);
        return rows[0];
    },
    async findById(db, id) {
        const { rows } = await db.query('SELECT * FROM proposals WHERE id = $1', [id]);
        return rows[0] || null;
    },
    async listForProject(db, projectId) {
        const { rows } = await db.query('SELECT * FROM proposals WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
        return rows;
    }
};
