// routes/categoryRoutes.js
const express = require('express');
const { getCategories } = require('../controllers/categoryController'); // Adjust path accordingly

const router = express.Router();

router.get('/', getCategories); // GET /api/categories

module.exports = router;
