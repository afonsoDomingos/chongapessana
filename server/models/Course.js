const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    description: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'MT' },
    status: { type: String, enum: ['active', 'coming_soon', 'announced'], default: 'announced' },
    startDate: { type: String },
    imageUrl: { type: String },
    materials: [{
        title: String,
        type: { type: String, enum: ['video', 'pdf', 'image'] },
        url: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
