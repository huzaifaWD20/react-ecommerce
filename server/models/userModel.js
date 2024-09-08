const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true,
           match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'] },
  password: { type: String, minlength: 8 },
  role: { type: String, enum: ['admin', 'user'], default: 'user'},
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]},{
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
