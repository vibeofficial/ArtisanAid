const mongoose = require('mongoose');

const allowedAdminEmail = "artisanaid.team@gmail.com"; 

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    set: (v) => v.replace(/\s+/g, ' ') 
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
    trim: true
  },
  age: {
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
  password: {
    type: String,
    required: true,
    trim: true
  },
  profilePic: {
    public_id: { type: String, trim: true },
    image_url: { type: String, trim: true }
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: function() {
      return this.email === allowedAdminEmail ? 'Admin' : 'User'; 
    },
    trim: true
  },
  jobCategory: {
    type: String, 
    required: true,
    trim: true
  },
  address: {
    lga: {
      type: String, 
      required: true,
      trim: true
    }, 
    state: { 
      type: String, 
      required: true,
      trim: true
    }
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
  subscription: {
    type: String,
    enum: ['Unlimited', 'Demo', 'Active', 'Expired'],
    trim: true
  },
  subscriptionId: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'subscriptions'
  }]
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
