const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.getAllUsers);


// Route pour l'inscription (Sign-up)
router.post('/signup', userCtrl.createUser); 

// Route pour la connexion (Login) -> Celle que tu vas tester
router.post('/login', userCtrl.login);

module.exports = router;

// utiliser auth sur une route 
// const auth = require('../middleware/auth');
// const productCtrl = require('../controllers/product.controller');

// // Seuls les utilisateurs connectés peuvent voir les produits
// router.get('/', auth, productCtrl.getAllProducts);