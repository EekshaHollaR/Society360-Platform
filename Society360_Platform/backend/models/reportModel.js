const db = require('../config/db');

const ReportModel = {
    /**
     * Get user statistics and trends
     */
    getUserReport: async (filters = {}) => {
        const { start_date, end_date } = filters;

        // Basic user statistics
        const statsQuery = `
            SELECT 
                COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_users,
                COUNT(*) FILTER (WHERE status = 'active' AND deleted_at IS NULL) as active_users,
                COUNT(*) FILTER (WHERE status = 'inactive' AND deleted_at IS NULL) as inactive_users,
                COUNT(*) FILTER (WHERE status = 'banned' AND deleted_at IS NULL) as banned_users,
                COUNT(*) FILTER (WHERE r.name = 'admin' AND deleted_at IS NULL) as admin_count,
                COUNT(*) FILTER (WHERE r.name = 'staff' AND deleted_at IS NULL) as staff_count,
                COUNT(*) FILTER (WHERE r.name = 'resident' AND deleted_at IS NULL) as resident_count
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
        `;
        const statsResult = await db.query(statsQuery);

        // Registration trends
        let trendsQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as registrations
            FROM users
            WHERE deleted_at IS NULL
        `;
        const trendsValues = [];
        let paramCount = 1;

        if (start_date) {
            trendsQuery += ` AND created_at >= $${paramCount}`;
            trendsValues.push(start_date);
            paramCount++;
        }
        if (end_date) {
            trendsQuery += ` AND created_at <= $${paramCount}`;
            trendsValues.push(end_date);
        }

        trendsQuery += ` GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`;
        const trendsResult = await db.query(trendsQuery, trendsValues);

        return {
            statistics: statsResult.rows[0],
            trends: trendsResult.rows
        };
    },

    /**
     * Get unit occupancy and distribution report
     */
    getUnitReport: async () => {
        const query = `
            SELECT 
                COUNT(*) as total_units,
                COUNT(*) FILTER (WHERE status = 'occupied') as occupied_units,
                COUNT(*) FILTER (WHERE status = 'vacant') as vacant_units,
                COUNT(*) FILTER (WHERE status = 'under_maintenance') as maintenance_units,
                COUNT(*) FILTER (WHERE type = '1BHK') as bhk_1,
                COUNT(*) FILTER (WHERE type = '2BHK') as bhk_2,
                COUNT(*) FILTER (WHERE type = '3BHK') as bhk_3,
                COUNT(*) FILTER (WHERE type = '4BHK') as bhk_4
            FROM units
        `;
        const result = await db.query(query);

        // Occupancy by block
        const blockQuery = `
            SELECT 
                b.name as block_name,
                COUNT(u.id) as total_units,
                COUNT(*) FILTER (WHERE u.status = 'occupied') as occupied,
                COUNT(*) FILTER (WHERE u.status = 'vacant') as vacant
            FROM blocks b
            LEFT JOIN units u ON b.id = u.block_id
            GROUP BY b.id, b.name
            ORDER BY b.name
        `;
        const blockResult = await db.query(blockQuery);

        return {
            summary: result.rows[0],
            by_block: blockResult.rows
        };
    },

    /**
     * Get financial summary report
     */
    getFinanceReport: async (filters = {}) => {
        const { start_date, end_date } = filters;

        let billsQuery = `
            SELECT 
                COUNT(*) as total_bills,
                SUM(amount) as total_amount,
                COUNT(*) FILTER (WHERE status = 'paid') as paid_bills,
                SUM(amount) FILTER (WHERE status = 'paid') as paid_amount,
                COUNT(*) FILTER (WHERE status = 'unpaid') as unpaid_bills,
                SUM(amount) FILTER (WHERE status = 'unpaid') as unpaid_amount,
                COUNT(*) FILTER (WHERE status = 'overdue') as overdue_bills,
                SUM(amount) FILTER (WHERE status = 'overdue') as overdue_amount
            FROM bills
            WHERE 1=1
        `;
        const billsValues = [];
        let paramCount = 1;

        if (start_date) {
            billsQuery += ` AND bill_date >= $${paramCount}`;
            billsValues.push(start_date);
            paramCount++;
        }
        if (end_date) {
            billsQuery += ` AND bill_date <= $${paramCount}`;
            billsValues.push(end_date);
        }

        const billsResult = await db.query(billsQuery, billsValues);

        // Payment trends
        let paymentsQuery = `
            SELECT 
                DATE(payment_date) as date,
                COUNT(*) as payment_count,
                SUM(amount_paid) as total_collected
            FROM payments
            WHERE status = 'success'
        `;
        const paymentsValues = [];
        let paymentParamCount = 1;

        if (start_date) {
            paymentsQuery += ` AND payment_date >= $${paymentParamCount}`;
            paymentsValues.push(start_date);
            paymentParamCount++;
        }
        if (end_date) {
            paymentsQuery += ` AND payment_date <= $${paymentParamCount}`;
            paymentsValues.push(end_date);
        }

        paymentsQuery += ` GROUP BY DATE(payment_date) ORDER BY date DESC LIMIT 30`;
        const paymentsResult = await db.query(paymentsQuery, paymentsValues);

        return {
            bills_summary: billsResult.rows[0],
            payment_trends: paymentsResult.rows
        };
    },

    /**
     * Get maintenance tickets report
     */
    getMaintenanceReport: async (filters = {}) => {
        const { start_date, end_date } = filters;

        let statsQuery = `
            SELECT 
                COUNT(*) as total_tickets,
                COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
                COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
                COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
                COUNT(*) FILTER (WHERE priority = 'low') as low_priority,
                COUNT(*) FILTER (WHERE priority = 'medium') as medium_priority,
                COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
                COUNT(*) FILTER (WHERE priority = 'critical') as critical_priority
            FROM maintenance_tickets
            WHERE 1=1
        `;
        const statsValues = [];
        let paramCount = 1;

        if (start_date) {
            statsQuery += ` AND created_at >= $${paramCount}`;
            statsValues.push(start_date);
            paramCount++;
        }
        if (end_date) {
            statsQuery += ` AND created_at <= $${paramCount}`;
            statsValues.push(end_date);
        }

        const statsResult = await db.query(statsQuery, statsValues);

        // Tickets by category
        const categoryQuery = `
            SELECT 
                category,
                COUNT(*) as count
            FROM maintenance_tickets
            GROUP BY category
            ORDER BY count DESC
        `;
        const categoryResult = await db.query(categoryQuery);

        return {
            statistics: statsResult.rows[0],
            by_category: categoryResult.rows
        };
    },

    /**
     * Get visitor logs report
     */
    getVisitorReport: async (filters = {}) => {
        const { start_date, end_date } = filters;

        let statsQuery = `
            SELECT 
                COUNT(*) as total_visitors,
                COUNT(*) FILTER (WHERE status = 'approved') as approved,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'denied') as denied,
                COUNT(*) FILTER (WHERE status = 'checked_in') as checked_in,
                COUNT(*) FILTER (WHERE status = 'checked_out') as checked_out
            FROM visitor_logs
            WHERE 1=1
        `;
        const statsValues = [];
        let paramCount = 1;

        if (start_date) {
            statsQuery += ` AND check_in_time >= $${paramCount}`;
            statsValues.push(start_date);
            paramCount++;
        }
        if (end_date) {
            statsQuery += ` AND check_in_time <= $${paramCount}`;
            statsValues.push(end_date);
        }

        const statsResult = await db.query(statsQuery, statsValues);

        // Visitors by purpose
        const purposeQuery = `
            SELECT 
                purpose,
                COUNT(*) as count
            FROM visitor_logs
            GROUP BY purpose
            ORDER BY count DESC
        `;
        const purposeResult = await db.query(purposeQuery);

        // Daily visitor trends
        let trendsQuery = `
            SELECT 
                DATE(check_in_time) as date,
                COUNT(*) as visitor_count
            FROM visitor_logs
            WHERE 1=1
        `;
        const trendsValues = [];
        let trendParamCount = 1;

        if (start_date) {
            trendsQuery += ` AND check_in_time >= $${trendParamCount}`;
            trendsValues.push(start_date);
            trendParamCount++;
        }
        if (end_date) {
            trendsQuery += ` AND check_in_time <= $${trendParamCount}`;
            trendsValues.push(end_date);
        }

        trendsQuery += ` GROUP BY DATE(check_in_time) ORDER BY date DESC LIMIT 30`;
        const trendsResult = await db.query(trendsQuery, trendsValues);

        return {
            statistics: statsResult.rows[0],
            by_purpose: purposeResult.rows,
            trends: trendsResult.rows
        };
    },

    /**
     * Get combined dashboard statistics
     */
    getDashboardStats: async () => {
        // Users
        const usersQuery = `
            SELECT 
                COUNT(*) FILTER (WHERE deleted_at IS NULL) as total,
                COUNT(*) FILTER (WHERE status = 'active' AND deleted_at IS NULL) as active
            FROM users
        `;
        const usersResult = await db.query(usersQuery);

        // Units
        const unitsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
                COUNT(*) FILTER (WHERE status = 'vacant') as vacant
            FROM units
        `;
        const unitsResult = await db.query(unitsQuery);

        // Maintenance
        const maintenanceQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'open') as open,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress
            FROM maintenance_tickets
        `;
        const maintenanceResult = await db.query(maintenanceQuery);

        // Finance
        const financeQuery = `
            SELECT 
                SUM(amount) FILTER (WHERE status = 'unpaid') as unpaid_amount,
                SUM(amount) FILTER (WHERE status = 'overdue') as overdue_amount,
                COUNT(*) FILTER (WHERE status = 'unpaid' OR status = 'overdue') as pending_bills
            FROM bills
        `;
        const financeResult = await db.query(financeQuery);

        // Recent visitors (today)
        const visitorsQuery = `
            SELECT COUNT(*) as today_visitors
            FROM visitor_logs
            WHERE DATE(check_in_time) = CURRENT_DATE
        `;
        const visitorsResult = await db.query(visitorsQuery);

        return {
            users: usersResult.rows[0],
            units: unitsResult.rows[0],
            maintenance: maintenanceResult.rows[0],
            finance: financeResult.rows[0],
            visitors: visitorsResult.rows[0]
        };
    }
};

module.exports = ReportModel;
