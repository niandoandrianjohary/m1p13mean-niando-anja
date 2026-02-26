const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// --- ROUTES PUBLIQUES (Accessibles par tous) ---

// Récupérer tous les produits (Page d'accueil)
router.get('/', productCtrl.getAllProducts);

// Rechercher des produits (ex: /search?query=pain)
router.get('/search', productCtrl.searchProducts);

// Récupérer les produits d'une catégorie spécifique
router.get('/category/:category', productCtrl.getProductsByCategory);

// Récupérer les produits d'une boutique précise
router.get('/shop/:shopId', productCtrl.getProductsByShop);

// Récupérer les produits de la boutique de l'utilisateur connecté
router.get('/my-shop', auth, productCtrl.getProductsByConnectedShop);

// Récupérer un produit par son ID
router.get('/:id', productCtrl.getProductById);


// --- ROUTES PROTÉGÉES ---

// Créer un produit : Seul un profil 'shop' peut le faire
router.post('/', auth, role(['shop']), productCtrl.createProduct);

module.exports = router;
