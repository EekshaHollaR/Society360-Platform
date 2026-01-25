const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { protect } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

// Validation middleware
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
    '/pre-approve',
    [
        check('visitor_name', 'Visitor name is required').not().isEmpty(),
        check('visitor_phone', 'Valid phone number is required').not().isEmpty(),
        check('unit_id', 'Unit ID is required').not().isEmpty(),
        validate
    ],
    visitorController.preApproveVisitor
);

router.post(
    '/check-in',
    [
        check('visitor_id', 'Visitor ID is required').optional().isUUID(),
        validate
    ],
    visitorController.checkInVisitor
);

router.post(
    '/check-out',
    [
        check('visitor_id', 'Visitor ID is required').isUUID(),
        validate
    ],
    visitorController.checkOutVisitor
);

router.get('/history', visitorController.getVisitorHistory);
router.get('/pending', visitorController.getPendingVisitors);

module.exports = router;
