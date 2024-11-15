const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const userSchema = new mongoose.Schema({
  name:{ type:String, required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
});

// Hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
