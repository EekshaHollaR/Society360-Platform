const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// All routes are protected
router.use(protect);

router.post(
    '/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('category', 'Category is required').not().isEmpty(),
        check('unit_id', 'Unit ID is required').not().isEmpty(),
        validate
    ],
    maintenanceController.createTicket
);

router.put(
    '/:id/assign',
    [
        check('staff_id', 'Staff ID is required').isUUID(),
        validate
    ],
    maintenanceController.assignTicket
);

router.put(
    '/:id/status',
    [
        check('status', 'Valid status is required').isIn(['open', 'in_progress', 'resolved', 'closed', 'rejected']),
        validate
    ],
    maintenanceController.updateTicketStatus
);

router.get('/', maintenanceController.getTicketHistory);

module.exports = router;
