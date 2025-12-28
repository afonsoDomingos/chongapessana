const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    proofUrl: { type: String },
    paymentDate: { type: Date },
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
