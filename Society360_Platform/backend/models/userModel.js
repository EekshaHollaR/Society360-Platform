const db = require('../config/db');

const User = {
    create: async (user) => {
        const { first_name, last_name, email, password, role, phone_number, profile_picture_url } = user;
        // Basic query, assumes table 'users' exists with these columns.
        // 'role' might be default 'Resident' if not provided, but we'll handle it here.
        const query = `
      INSERT INTO users (first_name, last_name, email, password_hash, role, phone_number, profile_picture_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, first_name, last_name, email, role, created_at;
    `;
        const values = [first_name, last_name, email, password, role || 'Resident', phone_number, profile_picture_url];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    },

    findById: async (id) => {
        const query = 'SELECT id, first_name, last_name, email, role, phone_number, profile_picture_url, created_at FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = User;
