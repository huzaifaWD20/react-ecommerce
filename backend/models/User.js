const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePic: { 
    type: String, 
    default: 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1727695676~exp=1727699276~hmac=fd0243f56f58063cb6bfd33204c036fc13453a047f14b173726087757c3671c4&w=740' 
  },
  cart: [{ 
    productID: { type: String, required: true }, // Use SKU as the productID (string type)
    quantity: { type: Number, default: 1 }
  }],
});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);