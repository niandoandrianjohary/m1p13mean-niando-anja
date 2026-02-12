require('dotenv').config(); // Charge les variables du .env
const express = require('express');
const connectDB = require('./config/db.config');

const app = express();

console.log("Ma clé secrète est :", process.env.JWT_SECRET);

const userRoutes = require('./routes/user.routes');

// Connexion à la base de données
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));