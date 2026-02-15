const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 1. LIRE toutes les boutiques (Public : Acheteurs, Boutiques et Admin)
router.get('/', shopCtrl.getAllShops);

// 2. LIRE une boutique spécifique par ID (Public)
router.get('/:id', shopCtrl.getShopById);

// 3. CRÉER une boutique (Sécurisé : Admin uniquement selon ta logique métier)
router.post('/', auth, role(['admin']), shopCtrl.createShop);

// 4. METTRE À JOUR une boutique (Sécurisé : Admin ou Propriétaire via la logique du controller)
router.put('/:id', auth, role(['admin', 'shop']), shopCtrl.updateShop);

// 5. VALIDER une boutique (Sécurisé : Admin uniquement)
// On utilise PATCH car on ne modifie que le statut
router.patch('/:id/verify', auth, role(['admin']), shopCtrl.verifyShop);

// 6. SUPPRIMER une boutique (Sécurisé : Admin uniquement)
router.delete('/:id', auth, role(['admin']), shopCtrl.deleteShop);

module.exports = router;