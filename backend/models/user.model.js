const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'shop', 'admin'], required: true },
    phone: String,
    address: String,
    // // Champs spécifiques au profil Boutique
    // shopName: String,
    // category: String,
    // location: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);