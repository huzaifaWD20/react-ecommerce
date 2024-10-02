// controllers/categoryController.js
const Category = require('../models/Category'); // Adjust path according to your structure

// Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories };
