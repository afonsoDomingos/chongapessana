const express = require('express');
const router = express.Router();
const ExpoTicket = require('../models/ExpoTicket');
const { auth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Get current user's ticket status
router.get('/my-ticket', auth, async (req, res) => {
    try {
        const ticket = await ExpoTicket.findOne({ userId: req.user.id });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Purchase ticket (create pending ticket)
router.post('/purchase', auth, async (req, res) => {
    try {
        const existingTicket = await ExpoTicket.findOne({ userId: req.user.id });
        if (existingTicket) {
            return res.status(400).json({ message: 'Ticket already exists', ticket: existingTicket });
        }

        const ticket = new ExpoTicket({
            userId: req.user.id,
            status: 'pending'
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload payment proof
router.post('/upload-proof', auth, upload.single('proof'), async (req, res) => {
    try {
        const ticket = await ExpoTicket.findOne({ userId: req.user.id });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        ticket.proofUrl = req.file.path;
        await ticket.save();

        res.json({ message: 'Proof uploaded successfully', ticket });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
