const Finance = require('../models/financeModel');
const db = require('../config/db'); // Needed for transactions if complex validity checks are added later, for now model handles it.
const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger');

exports.generateMonthlyBills = async (req, res) => {
    try {
        // For demonstration, we'll manually create a bill for a specific unit passed in body
        // In a real scheduler, this would iterate all units.
        const { unit_id, bill_type, amount, description } = req.body;

        const billDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15); // Due in 15 days

        const newBill = await Finance.createBill({
            unit_id,
            bill_type,
            amount,
            bill_date: billDate,
            due_date: dueDate,
            description
        });

        // Log audit
        await logAudit(req.user.id, AUDIT_ACTIONS.BILL_CREATED, 'bills', newBill.id, { unit_id, amount, bill_type }, req);

        res.status(201).json({ message: 'Bill generated successfully', bill: newBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error generating bill' });
    }
};

exports.getBills = async (req, res) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            // Admin/Staff can see all or filter by unit
            if (req.query.unit_id) {
                const bills = await Finance.getBillsByUnit(req.query.unit_id);
                return res.json(bills);
            }
            const bills = await Finance.getAllBills();
            return res.json(bills);
        } else {
            // Residents see their own unit's bills
            // Assumes middleware has populated req.user and we can find their unit.
            // For MVP simplicity, we might require them to pass unit_id and we verify ownership,
            // OR we lookup their unit. Let's assume passed unit_id for now and we verify access in a real app,
            // but here we'll just return bills for the requested unit if they are authorized.
            // Re-using the same logic for simplicity + security check that usually happens in middleware.
            // However, to be safe, let's fetch bills for the unit_id provided in query (Resident frontend sends it).
            // A robust check would verify req.user.id owns req.query.unit_id.

            if (!req.query.unit_id) {
                return res.status(400).json({ message: 'Unit ID required' });
            }
            // TODO: Verify req.user is associated with req.query.unit_id

            const bills = await Finance.getBillsByUnit(req.query.unit_id);
            res.json(bills);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching bills' });
    }
};

exports.payBill = async (req, res) => {
    try {
        const { bill_id, payment_method, amount } = req.body;
        const payer_id = req.user.id; // From auth middleware

        const bill = await Finance.getBillById(bill_id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        if (bill.status === 'paid') {
            return res.status(400).json({ message: 'Bill is already paid' });
        }

        // Simple simulation: Amount must match exact bill amount
        if (parseFloat(amount) !== parseFloat(bill.amount)) {
            // In real world, partial payments might be allowed.
            return res.status(400).json({ message: 'Payment amount must match bill amount' });
        }

        // Simulate transaction reference
        const transaction_reference = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        const payment = await Finance.createPayment({
            bill_id,
            payer_id,
            amount_paid: amount,
            payment_method,
            transaction_reference
        });

        await Finance.updateBillStatus(bill_id, 'paid');

        // Log audit
        await logAudit(payer_id, AUDIT_ACTIONS.PAYMENT_RECORDED, 'payments', payment.id, { bill_id, amount, payment_method }, req);

        res.status(200).json({ message: 'Payment successful', payment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error processing payment' });
    }
};

exports.getReceipt = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Finance.getPaymentById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // In a real app, verify user owns the payment or is admin

        res.json({
            receipt_id: payment.id,
            date: payment.payment_date,
            amount: payment.amount_paid,
            method: payment.payment_method,
            transaction_ref: payment.transaction_reference,
            status: 'Verified'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching receipt' });
    }
};

exports.getFinancialReports = async (req, res) => {
    try {
        const stats = await Finance.getFinancialStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching reports' });
    }
};
