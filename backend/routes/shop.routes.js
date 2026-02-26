const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 1. LIRE toutes les boutiques (Public : Acheteurs, Boutiques et Admin)
router.get('/', shopCtrl.getAllShops);

// 8. Récupérer les boutiques où le statut est 'pending' (Sécurisé : Admin uniquement)
router.get('/pending', auth, role(['admin']), shopCtrl.getPendingShops);

// 9. Récupérer les boutiques où le statut est 'active' (Sécurisé : Admin uniquement)
router.get('/active', auth, role(['admin']), shopCtrl.getActiveShops);

router.get('/owner', auth, shopCtrl.getShopByOwnerId);

router.get('/connected-shop', auth, shopCtrl.getConnectedShop);

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

// 7. CRÉER un utilisateur pour une boutique (Sécurisé : Shop)
router.post('/shop-user', auth, role(['shop']), shopCtrl.createShopUser);

// 9. REJETER une boutique (Sécurisé : Admin uniquement)
router.patch('/:id/reject', auth, role(['admin']), shopCtrl.rejectShop);

// 10. APPROUVER une boutique (Sécurisé : Admin uniquement)
router.patch('/:id/approve', auth, role(['admin']), shopCtrl.approveShop);

module.exports = router;

