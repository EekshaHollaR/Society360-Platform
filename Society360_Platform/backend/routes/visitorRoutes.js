const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/pre-approve', visitorController.preApproveVisitor);
router.post('/check-in', visitorController.checkInVisitor);
router.post('/check-out', visitorController.checkOutVisitor);
router.get('/history', visitorController.getVisitorHistory);
router.get('/pending', visitorController.getPendingVisitors);

module.exports = router;
