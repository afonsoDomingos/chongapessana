const mongoose = require('mongoose');

const expoTicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    proofUrl: { type: String },
    price: { type: Number, default: 100 },
    currency: { type: String, default: 'MT' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExpoTicket', expoTicketSchema);
