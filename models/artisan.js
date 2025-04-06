const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
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
  category: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Artisan',
  },
  profilePic: {
    public_id: { type: String },
    image_url: { type: String }
  },
  coverPhoto: {
    public_id: { type: String },
    image_url: { type: String }
  },
  location: {
    number: {type: String},
    street: {type: String},
    lga: { type: String },
    state: { type: String }
  },
  accountVerification: {
    type: String,
    enum: ['Unverified','Pending', 'Verified', 'Declined'],
    default: 'Unverified'
  },
  rating: {
    type: Number,
    default: 0
  },
  subscription: {
    type: String,
    enum: [ 'Demo', 'Active', 'Expired'],
    default: 'Demo'
  },
  subscriptionPlan: {
    type: String,
    enum: ['Demo', 'Regular', 'Premium'],
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
  expiresIn: {
    type: Number,
    require: true
  },
}, { timestamps: true });

const artisanModel = mongoose.model('artisans', artisanSchema);

module.exports = artisanModel;