const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

// Route pour l'inscription (Sign-up)
router.post('/signup', userCtrl.createUser); 

// Route pour la connexion (Login) -> Celle que tu vas tester
router.post('/login', userCtrl.login); 

module.exports = router;