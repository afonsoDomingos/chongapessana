const express = require('express');
const router = express.Router();
const { getAllEnrollments, updateEnrollmentStatus, createCourse } = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');
const ExpoTicket = require('../models/ExpoTicket');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { cloudinary, storage } = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary Storage for materials
const materialStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chonga-materials',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'webm']
    }
});

const uploadMaterial = multer({ storage: materialStorage });

router.use(auth, admin);

// Upload Material File
router.post('/upload-material', uploadMaterial.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado' });
        }
        res.json({
            url: req.file.path,
            public_id: req.file.filename
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/enrollments', getAllEnrollments);
router.patch('/enrollments/:id', updateEnrollmentStatus);
router.post('/courses', createCourse);

// Delete Course
router.delete('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado' });
        }
        // Also delete all enrollments for this course
        await Enrollment.deleteMany({ courseId: req.params.id });
        res.json({ message: 'Curso eliminado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Material to Course
router.post('/courses/:id/materials', async (req, res) => {
    try {
        const { title, type, url } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado' });
        }
        course.materials.push({ title, type, url });
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Material from Course
router.delete('/courses/:courseId/materials/:materialId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado' });
        }
        course.materials = course.materials.filter(m => m._id.toString() !== req.params.materialId);
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Expo Tickets Management
router.get('/expo-tickets', async (req, res) => {
    try {
        const tickets = await ExpoTicket.find().populate('userId');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/expo-tickets/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await ExpoTicket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
