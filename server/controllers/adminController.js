const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('userId').populate('courseId');
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // approved | rejected

        const enrollment = await Enrollment.findByIdAndUpdate(id, { status }, { new: true });
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllEnrollments, updateEnrollmentStatus, createCourse };
