const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);