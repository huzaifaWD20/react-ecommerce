const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

// Define Review Schema Reference
const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  review: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

// Define User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150', // Default profile picture URL
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^\+?[1-9]\d{1,14}$/,
      'Please fill a valid phone number',
    ], // E.164 format
  },

  cart: [cartItemSchema], // Embedded Cart Items
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  reviews: [reviewSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;