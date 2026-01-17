const Announcement = require('../models/announcementModel');
const Notification = require('../models/notificationModel');
const db = require('../config/db');

// @desc    Create new announcement (Admin only)
// @route   POST /api/communication/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
    const { title, content, target_audience, is_important, expires_at } = req.body;

    try {
        const announcement = await Announcement.create({
            title,
            content,
            author_id: req.user.id,
            target_audience,
            is_important,
            expires_at
        });

        // Create notifications for all residents
        const residentsQuery = 'SELECT id FROM users WHERE role_id = 3'; // Assuming role_id 3 is Resident
        const residents = await db.query(residentsQuery);

        const notificationPromises = residents.rows.map(resident =>
            Notification.create({
                user_id: resident.id,
                type: 'announcement',
                message: `New announcement: ${title}`,
                reference_id: announcement.id
            })
        );

        await Promise.all(notificationPromises);

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all announcements
// @route   GET /api/communication/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.getAll();
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete announcement (Admin only)
// @route   DELETE /api/communication/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        const deleted = await Announcement.delete(req.params.id);
        if (deleted) {
            res.json({ message: 'Announcement deleted' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
};
