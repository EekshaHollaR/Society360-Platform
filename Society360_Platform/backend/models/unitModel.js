const db = require('../config/db');

const Unit = {
    create: async (unit) => {
        const { block_id, unit_number, floor_number, type, status } = unit;
        const query = `
            INSERT INTO units (block_id, unit_number, floor_number, type, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [block_id, unit_number, floor_number, type, status || 'vacant'];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = 'SELECT * FROM units';
        const result = await db.query(query);
        return result.rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM units WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    findByBlock: async (block_id) => {
        const query = 'SELECT * FROM units WHERE block_id = $1';
        const result = await db.query(query, [block_id]);
        return result.rows;
    },

    findUnitsByUser: async (user_id) => {
        const query = `
            SELECT u.*, uu.resident_type 
            FROM units u
            JOIN user_units uu ON u.id = uu.unit_id
            WHERE uu.user_id = $1 AND uu.status = 'active'
        `;
        const result = await db.query(query, [user_id]);
        return result.rows;
    }
};

module.exports = Unit;
