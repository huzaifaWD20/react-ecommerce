const express = require('express');
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Middleware to check if user is authenticated
const router = express.Router();

// Create a new order
router.post('/create', createOrder);

// Get order by ID (only the user who placed the order or an admin can view)
router.get('/:orderId', getOrderById);

// Get all orders for the logged-in user
router.get('/user/orders', isAuthenticated, getUserOrders);

// Update order status (e.g., mark as shipped or delivered)
router.put('/:orderId/status', isAuthenticated, updateOrderStatus);

// Delete an order (optional)
router.delete('/:orderId', isAuthenticated, deleteOrder);

module.exports = router;
