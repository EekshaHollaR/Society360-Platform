const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

// Admin only: Generate bills
router.post('/generate', protect, authorize('admin', 'staff'), financeController.generateMonthlyBills);

// Admin & Resident: Get bills
// Admin/Staff can query all or specific unit. Resident sees their own.
router.get('/', protect, financeController.getBills);

// Resident only: Pay bill
router.post('/pay', protect, authorize('resident'), financeController.payBill);

// Authenticated: Get receipt
router.get('/receipt/:paymentId', protect, financeController.getReceipt);

// Admin only: Financial Reports
router.get('/reports', protect, authorize('admin'), financeController.getFinancialReports);

module.exports = router;
