const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    require: true,
    trim: true
  },
  location: {
    number: { type: String, trim: true },
    street: { type: String, trim: true },
    lga: { type: String, trim: true },
    state: { type: String, trim: true }
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    public_id: { type: String, trim: true },
    image_url: { type: String, trim: true }
  },
  role: {
    type: String,
    default: 'Employer'
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

const employerModel = mongoose.model('employers', employerSchema);

module.exports = employerModel;