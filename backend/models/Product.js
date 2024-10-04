const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: String,
  sku: String,
  product_name: String,
  description: String,
  price: Number,
  image_base64: String,  // Storing image as base64
  category: String,
});

module.exports = mongoose.model('Product', productSchema);
