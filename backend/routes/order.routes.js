const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.post('/', auth, role(['buyer']), orderCtrl.createOrder);

router.get('/my-shop/', auth, role(['shop']), orderCtrl.getShopOrders);

router.get('/', auth, role(['buyer', 'shop', 'admin']), orderCtrl.getUserOrders);

router.patch('/:orderId/status', auth, role(['shop', 'admin']), orderCtrl.updateOrderStatus);

router.post('/create', auth, role(['buyer']), orderCtrl.createOrderWithUserId);

module.exports = router;

