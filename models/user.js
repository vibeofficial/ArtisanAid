const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    public_id: { type: String },
    image_url: { type: String }
  },
  coverPhoto: {
    public_id: { type: String },
    image_url: { type: String }
  },
  category: {
    type: String,
  },
  address: {
    number: {type: String},
    street: {type: String},
    lga: { type: String },
    state: { type: String }
  },
  role: {
    type: String,
    enum: ['Admin', 'Artisan'],
  },
  accountVerification: {
    type: String,
    enum: ['Unverified','Pending', 'Verified', 'Declined'],
    default: 'Unverified'
  },
  subscription: {
    type: String,
    enum: ['Unlimited', 'Demo', 'Active', 'Expired'],
    default: 'Demo'
  },
  subscriptionPlan: {
    type: String,
    enum: ['Unlimited', 'Demo', 'Regular', 'Premium'],
    default: 'Demo'
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isRestricted: {
    type: Boolean,
    default: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  expires: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;