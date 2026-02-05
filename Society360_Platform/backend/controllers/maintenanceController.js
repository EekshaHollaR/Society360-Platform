const MaintenanceTicket = require('../models/maintenanceModel');
const Unit = require('../models/unitModel');
const User = require('../models/userModel');
const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger');

const MaintenanceController = {
    createTicket: async (req, res) => {
        try {
            const { unit_id, category, title, description, priority } = req.body;
            const requesterId = req.user.id;

            // Verify resident owns/rents the unit
            const userUnits = await Unit.findUnitsByUser(requesterId);
            const isAuthorized = userUnits.some(u => u.id === unit_id);

            if (!isAuthorized && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized for this unit' });
            }

            const ticket = await MaintenanceTicket.create({
                unit_id,
                requester_id: requesterId,
                category,
                title,
                description,
                priority
            });

            // Log audit
            await logAudit(requesterId, AUDIT_ACTIONS.TICKET_CREATED, 'maintenance_tickets', ticket.id, { title, category, priority }, req);

            res.status(201).json({ success: true, data: ticket, message: 'Ticket created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    assignTicket: async (req, res) => {
        try {
            const { id } = req.params;
            const { staff_id } = req.body;

            // Verify staff exists and is actually staff
            const staff = await User.findById(staff_id);
            if (!staff || (staff.role !== 'staff' && staff.role !== 'admin')) {
                return res.status(400).json({ success: false, message: 'Invalid staff user' });
            }

            const ticket = await MaintenanceTicket.assign(id, staff_id);
            if (!ticket) {
                return res.status(404).json({ success: false, message: 'Ticket not found' });
            }

            // Log audit
            await logAudit(req.user.id, AUDIT_ACTIONS.TICKET_ASSIGNED, 'maintenance_tickets', id, { assigned_to: staff_id }, req);

            res.json({ success: true, data: ticket, message: 'Ticket assigned' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    updateTicketStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate status enum if needed, or rely on DB constraint
            const validStatuses = ['open', 'in_progress', 'resolved', 'closed', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }

            const ticket = await MaintenanceTicket.updateStatus(id, status);
            if (!ticket) {
                return res.status(404).json({ success: false, message: 'Ticket not found' });
            }

            // Log audit
            const action = status === 'resolved' ? AUDIT_ACTIONS.TICKET_RESOLVED : AUDIT_ACTIONS.TICKET_UPDATED;
            await logAudit(req.user.id, action, 'maintenance_tickets', id, { new_status: status }, req);

            res.json({ success: true, data: ticket, message: 'Ticket status updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    getTicketHistory: async (req, res) => {
        try {
            const { role, id } = req.user;

            if (role === 'resident') {
                const userUnits = await Unit.findUnitsByUser(id);
                const history = [];
                for (const unit of userUnits) {
                    const tickets = await MaintenanceTicket.findByUnit(unit.id);
                    history.push(...tickets);
                }
                // Sort desc
                history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                return res.json({ success: true, data: history });
            } else if (role === 'staff') {
                const assigned = await MaintenanceTicket.findByAssignedStaff(id);
                return res.json({ success: true, data: assigned });
            } else {
                // Admin sees all
                const allTickets = await MaintenanceTicket.findAll();
                res.json({ success: true, data: allTickets });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }

};

module.exports = MaintenanceController;
