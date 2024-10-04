// routes/productRoutes.js
const express = require('express');
const { getAllProducts, getProductById } = require('../controllers/productController');
const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by productID
router.get('/:id', getProductById);

module.exports = router;
