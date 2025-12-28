const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enroll = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; // From auth middleware

        // Check if already enrolled
        const existing = await Enrollment.findOne({ userId, courseId });
        if (existing) return res.status(400).json({ message: 'Already enrolled or pending' });

        const enrollment = new Enrollment({
            userId,
            courseId,
            status: 'pending'
        });

        await enrollment.save();
        res.status(201).json(enrollment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const uploadProof = async (req, res) => {
    try {
        const { enrollmentId } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        enrollment.proofUrl = req.file.path; // Cloudinary URL
        await enrollment.save();

        res.json({ message: 'Proof uploaded successfully', proofUrl: enrollment.proofUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStudentEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { enroll, uploadProof, getStudentEnrollments };
