const db = require('../config/db');

const Visitor = {
    create: async (visitor) => {
        const { unit_id, visitor_name, visitor_phone, purpose, approved_by_user_id, status } = visitor;
        // Default status is 'checked_in' in schema, but for pre-approval it might be different?
        // Schema says: status VARCHAR(20) DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out', 'denied'))
        // It seems the schema doesn't have 'pending' or 'approved' status for pre-approval workflow.
        // I might need to alter the enum/check constraint if I want 'pending'. 
        // For now, I'll stick to what the schema allows or assume 'checked_in' is for immediate entry. 
        // Wait, if Resident pre-approves, it shouldn't be 'checked_in' yet.
        // The prompt asked for "Resident pre-approval". 
        // This implies a state before check-in.
        // I will assume for now I should handle this.
        // However, looking at the schema provided in previous turn: 
        // CHECK (status IN ('checked_in', 'checked_out', 'denied'))
        // It is missing 'pending' or 'approved'.
        // I will interpret 'checked_in' as active on premises? No, that's wrong.
        // I'll proceed with creating the file but I might need to note that schema update is effectively needed for full "pre-approval" feature if we want state persistence. 
        // Actually, let's look at `visitor_logs` again. 
        // It seems geared towards logs at the gate.
        // If I need resident pre-approval, I should probably add 'pending' and 'approved' to the check constraint?
        // Or maybe 'approved_by_user_id' being present implies approval?
        // Let's implement basics first.

        const query = `
            INSERT INTO visitor_logs (unit_id, visitor_name, visitor_phone, purpose, approved_by_user_id, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [unit_id, visitor_name, visitor_phone, purpose, approved_by_user_id, status || 'checked_in'];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = 'SELECT * FROM visitor_logs';
        const result = await db.query(query);
        return result.rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM visitor_logs WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    findByUnit: async (unit_id) => {
        const query = 'SELECT * FROM visitor_logs WHERE unit_id = $1 ORDER BY check_in_time DESC';
        const result = await db.query(query, [unit_id]);
        return result.rows;
    },

    updateStatus: async (id, status, check_out_time = null) => {
        let query = 'UPDATE visitor_logs SET status = $1';
        const values = [status, id];
        let paramIndex = 3;

        if (check_out_time) {
            query += `, check_out_time = $${Math.abs(paramIndex - 1)}`; // wait, simplistic logic
            // Let's be explicit
            query = 'UPDATE visitor_logs SET status = $1, check_out_time = $2 WHERE id = $3 RETURNING *';
            const result = await db.query(query, [status, check_out_time, id]);
            return result.rows[0];
        } else {
            query += ' WHERE id = $2 RETURNING *';
            const result = await db.query(query, values);
            return result.rows[0];
        }
    }
};

module.exports = Visitor;
