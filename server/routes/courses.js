const express = require('express');
const router = express.Router();
const { enroll, uploadProof, getStudentEnrollments } = require('../controllers/courseController');
const { auth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/enroll', auth, enroll);
router.post('/upload-proof', auth, upload.single('proof'), uploadProof);
router.get('/my-courses', auth, getStudentEnrollments);

module.exports = router;
