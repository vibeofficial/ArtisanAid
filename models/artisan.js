const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  businessName: {
    type: String,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Artisan'
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
    lga: { type: String, trim: true },
    state: { type: String, default: 'Lagos' }
  },
  verificationStatus: {
    type: String,
    enum: ['Unverified', 'Pending', 'Approved', 'Declined'],
    default: 'Unverified'
  },
  bio: {
    type: String,
    trim: true
  },
  socialMediaLink: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0
  },
  subscription: {
    type: String,
    enum: ['Free', 'Active', 'Expired'],
    default: 'Free'
  },
  subscriptionPlan: {
    type: String,
    enum: ['FREEMIUM PLAN', 'BASIC PLAN', 'PREMIUM PLAN'],
    default: 'FREEMIUM PLAN'
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
  isReported: {
    type: Boolean,
    default: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  expiresIn: {
    type: Number,
    required: true
  },
  jobPost: {
    public_id: { type: String, require: true },
    image_url: { type: String, require: true }
  },
  verificationId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'verifications'
  }
}, { timestamps: true });

const artisanModel = mongoose.model('artisans', artisanSchema);

module.exports = artisanModel;