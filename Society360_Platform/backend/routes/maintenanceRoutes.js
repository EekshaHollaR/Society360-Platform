const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', maintenanceController.createTicket);
router.put('/:id/assign', maintenanceController.assignTicket);
router.put('/:id/status', maintenanceController.updateTicketStatus);
router.get('/', maintenanceController.getTicketHistory);

module.exports = router;
