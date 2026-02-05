const Visitor = require('../models/visitorModel');
const Unit = require('../models/unitModel');
const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger');

const VisitorController = {
    // Resident Action
    preApproveVisitor: async (req, res) => {
        try {
            const { visitor_name, visitor_phone, name, phone_number, purpose, unit_id } = req.body;
            const userId = req.user.id; // From authMiddleware

            // Use fallbacks from frontend field names if specific ones aren't provided
            const final_name = visitor_name || name;
            const final_phone = visitor_phone || phone_number;

            if (!final_name) {
                return res.status(400).json({ success: false, message: 'Visitor name is required' });
            }

            // Verify if the user is associated with the unit
            const userUnits = await Unit.findUnitsByUser(userId);
            const isAuthorized = userUnits.some(unit => unit.id === unit_id);

            if (!isAuthorized && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Not authorized for this unit' });
            }

            const visitor = await Visitor.create({
                unit_id,
                visitor_name: final_name,
                visitor_phone: final_phone,
                purpose,
                approved_by_user_id: userId,
                status: 'approved'
            });

            // Log audit
            await logAudit(userId, AUDIT_ACTIONS.VISITOR_APPROVED, 'visitor_logs', visitor.id, { visitor_name: final_name, unit_id }, req);

            res.status(201).json({ success: true, data: visitor, message: 'Visitor pre-approved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    // Staff/Admin Action
    checkInVisitor: async (req, res) => {
        try {
            const { visitor_id } = req.body;
            const securityGuardId = req.user.id;

            let visitor;
            if (visitor_id) {
                visitor = await Visitor.updateStatus(visitor_id, 'checked_in');
                // Log audit
                await logAudit(securityGuardId, AUDIT_ACTIONS.VISITOR_CHECKED_IN, 'visitor_logs', visitor_id, { method: 'PRE_APPROVED' }, req);
            } else {
                // Walk-in creation
                const { unit_id, visitor_name, visitor_phone, purpose, name, phone_number } = req.body;
                const final_name = visitor_name || name;
                const final_phone = visitor_phone || phone_number;

                visitor = await Visitor.create({
                    unit_id,
                    visitor_name: final_name,
                    visitor_phone: final_phone,
                    purpose,
                    security_guard_id: securityGuardId,
                    status: 'checked_in'
                });
                // Log audit
                await logAudit(securityGuardId, AUDIT_ACTIONS.VISITOR_CHECKED_IN, 'visitor_logs', visitor.id, { method: 'WALK_IN', visitor_name: final_name, unit_id }, req);
            }

            res.json({ success: true, data: visitor, message: 'Visitor checked in' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    checkOutVisitor: async (req, res) => {
        try {
            const { visitor_id } = req.body;
            const visitor = await Visitor.updateStatus(visitor_id, 'checked_out', new Date());

            // Log audit
            await logAudit(req.user.id, AUDIT_ACTIONS.VISITOR_CHECKED_OUT, 'visitor_logs', visitor_id, {}, req);

            res.json({ success: true, data: visitor, message: 'Visitor checked out' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    getVisitorHistory: async (req, res) => {
        try {
            const { role, id } = req.user;

            if (role === 'resident') {
                const userUnits = await Unit.findUnitsByUser(id);
                const history = [];
                for (const unit of userUnits) {
                    const logs = await Visitor.findByUnit(unit.id);
                    history.push(...logs);
                }
                history.sort((a, b) => new Date(b.check_in_time || b.created_at) - new Date(a.check_in_time || a.created_at));

                return res.json({ success: true, data: history });
            } else {
                // Admin/Staff sees all
                const history = await Visitor.findAll();
                return res.json({ success: true, data: history });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },

    getPendingVisitors: async (req, res) => {
        try {
            const allVisitors = await Visitor.findAll();
            const pending = allVisitors.filter(v => v.status === 'approved' || v.status === 'pending');
            res.json({ success: true, data: pending });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }

};

module.exports = VisitorController;
