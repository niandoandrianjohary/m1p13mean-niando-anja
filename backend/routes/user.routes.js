const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// --- ROUTES PUBLIQUES ---

// Inscription générique (utilisée par ton binôme pour les tests)
router.post('/signup/shop', userCtrl.signupShop);

// Inscription spécifique pour les Acheteurs (avec ton nouveau schéma à plat)
router.post('/signup/buyer', userCtrl.signupBuyer);

// Connexion (Login) - Renvoie le Token JWT
router.post('/login', userCtrl.login);

// Inscription générique (utilisée par ton binôme pour les tests)
router.post('/signup', userCtrl.signup);

// --- ROUTES PROTÉGÉES ---

// Créer un utilisateur (seul un profil 'admin' peut le faire)
router.post('/create-user', auth, role(['admin']), userCtrl.createUser);

// Seul l'admin peut voir la liste de tous les utilisateurs
router.get('/', auth, role(['admin']), userCtrl.getAllUsers);

module.exports = router;
