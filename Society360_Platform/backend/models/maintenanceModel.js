const db = require('../config/db');

const MaintenanceTicket = {
    create: async (ticket) => {
        const { unit_id, requester_id, category, title, description, priority } = ticket;
        const query = `
            INSERT INTO maintenance_tickets (unit_id, requester_id, category, title, description, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [unit_id, requester_id, category, title, description, priority || 'medium'];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findById: async (id) => {
        const query = 'SELECT * FROM maintenance_tickets WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    findAll: async () => {
        const query = 'SELECT * FROM maintenance_tickets ORDER BY created_at DESC';
        const result = await db.query(query);
        return result.rows;
    },

    findByUnit: async (unit_id) => {
        const query = 'SELECT * FROM maintenance_tickets WHERE unit_id = $1 ORDER BY created_at DESC';
        const result = await db.query(query, [unit_id]);
        return result.rows;
    },

    findByAssignedStaff: async (staff_id) => {
        const query = 'SELECT * FROM maintenance_tickets WHERE assigned_to_id = $1 ORDER BY created_at DESC';
        const result = await db.query(query, [staff_id]);
        return result.rows;
    },

    assign: async (id, staff_id) => {
        const query = `
            UPDATE maintenance_tickets 
            SET assigned_to_id = $1, status = 'in_progress' 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await db.query(query, [staff_id, id]);
        return result.rows[0];
    },

    updateStatus: async (id, status) => {
        let query = 'UPDATE maintenance_tickets SET status = $1';
        const values = [status, id];

        if (status === 'resolved') {
            query += ', resolved_at = NOW()';
        }

        query += ' WHERE id = $2 RETURNING *';

        const result = await db.query(query, values);
        return result.rows[0];
    }
};

module.exports = MaintenanceTicket;
