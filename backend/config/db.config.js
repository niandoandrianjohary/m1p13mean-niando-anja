// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // process.env.MONGODB_URI récupère la valeur depuis ton fichier .env
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connecté à MongoDB avec succès !");
    } catch (err) {
        console.error("Erreur de connexion :", err.message);
        process.exit(1); // Arrête l'application en cas d'échec
    }
};

module.exports = connectDB;