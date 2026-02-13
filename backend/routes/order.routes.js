const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Seul le buyer crée une commande
router.post('/', auth, role(['buyer']), orderCtrl.createOrder);

// Seul le shop met à jour le statut
router.patch('/:orderId/status', auth, role(['shop']), orderCtrl.updateOrderStatus);
// Dans routes/order.routes.js

// GET /api/orders/my-orders
// Accessible par les acheteurs ET les boutiques
router.get('/my-orders', auth, role(['buyer', 'shop']), orderCtrl.getUserOrders);

module.exports = router;