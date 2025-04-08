const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    public_id: { type: String, trim: true },
    image_url: { type: String, trim: true }
  },
  coverPhoto: {
    public_id: { type: String, trim: true },
    image_url: { type: String, trim: true }
  },
  role: {
    type: String,
    default: 'Admin',
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const adminModel = mongoose.model('admins', adminSchema);

module.exports = adminModel;