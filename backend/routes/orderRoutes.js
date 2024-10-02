const express = require('express');
const router = express.Router();
// const { isAuthenticated } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.put('/update-status', orderController.updateOrderStatus);

module.exports = router;