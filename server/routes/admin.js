const express = require('express');
const router = express.Router();
const { getAllEnrollments, updateEnrollmentStatus, createCourse } = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');
const ExpoTicket = require('../models/ExpoTicket');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { cloudinary } = require('../config/cloudinary');
const multer = require('multer');

// Use memory storage for custom Cloudinary upload
const memoryStorage = multer.memoryStorage();
const uploadMaterial = multer({
    storage: memoryStorage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.use(auth, admin);

// Upload Material File with proper resource_type handling
router.post('/upload-material', uploadMaterial.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado' });
        }

        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

        // Determine resource_type based on file type
        let resourceType = 'auto';
        if (fileExtension === 'pdf') {
            resourceType = 'raw';
        } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
            resourceType = 'video';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            resourceType = 'image';
        }

        // Upload to Cloudinary with correct resource_type
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'chonga-materials',
                    resource_type: resourceType,
                    public_id: `material_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}`
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: resourceType
        });
    } catch (err) {
        console.error('Upload error:', err);
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
