const express = require('express');
const { saveCartToDatabase, getCartFromDatabase } = require('../controllers/cartController');

const router = express.Router();

router.post('/save-database', saveCartToDatabase);
router.get('/get-database', getCartFromDatabase);

module.exports = router;