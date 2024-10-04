// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryId: Number , // Unique identifier for the category
    CategoryName: String, // Display name for the category
})

module.exports = mongoose.model('Category', categorySchema);
