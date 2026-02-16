require('dotenv').config(); // Charge les variables du .env
const express = require('express');
const connectDB = require('./config/db.config');
const cors = require('cors');
const app = express();

console.log("Ma clé secrète est :", process.env.JWT_SECRET);

const userRoutes = require('./routes/user.routes');
const OrdersRoutes = require('./routes/order.routes');
const shopRoutes = require('./routes/shop.routes');
const productRoutes = require('./routes/product.routes');
// Connexion à la base de données
connectDB();

// Configuration des options CORS
const corsOptions = {
  origin: 'http://localhost:4200', // L'URL de ton frontend Angular
  methods: 'GET,POST,PUT,DELETE,PATCH', // Autorise toutes les méthodes CRUD
  allowedHeaders: 'Content-Type,Authorization', // Autorise le header pour le Token JWT
  optionsSuccessStatus: 200
};

// Application du middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/orders', OrdersRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));