const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 1. Créer une commande (Réservé aux acheteurs connectés)
// URL: POST /api/orders
router.post('/', auth, role(['buyer']), orderCtrl.createOrder);

// 2. Récupérer les commandes de l'utilisateur connecté (Acheteur ou Boutique)
// URL: GET /api/orders
router.get('/', auth, role(['buyer', 'shop', 'admin']), orderCtrl.getUserOrders);

// 3. Mettre à jour le statut d'une commande (Boutique ou Admin)
// URL: PATCH /api/orders/:orderId/status
router.patch('/:orderId/status', auth, role(['shop', 'admin']), orderCtrl.updateOrderStatus);

// 4. Créer une commande avec un ID utilisateur (Réservé aux acheteurs connectés)
// URL: POST /api/orders/with-user
router.post('/with-user', auth, role(['buyer']), orderCtrl.createOrderWithUserId);

module.exports = router;