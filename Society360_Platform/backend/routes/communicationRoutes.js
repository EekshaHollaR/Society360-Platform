const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

// Import controllers
const {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
} = require('../controllers/announcementController');

const {
    postMessage,
    getMessages,
    deleteMessage,
    flagMessage
} = require('../controllers/messageController');

const {
    getUserNotifications,
    markNotificationRead
} = require('../controllers/notificationController');

// Announcement routes
router.post('/announcements', protect, authorize('Admin'), createAnnouncement);
router.get('/announcements', protect, getAnnouncements);
router.delete('/announcements/:id', protect, authorize('Admin'), deleteAnnouncement);

// Message board routes
router.post('/messages', protect, postMessage);
router.get('/messages', protect, getMessages);
router.delete('/messages/:id', protect, deleteMessage);
router.put('/messages/:id/flag', protect, authorize('Admin'), flagMessage);

// Notification routes
router.get('/notifications', protect, getUserNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
