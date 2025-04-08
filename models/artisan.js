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
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Artisan'],
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
    number: { type: String, trim: true },
    street: { type: String, trim: true },
    lga: { type: String, trim: true },
    state: { type: String, trim: true }
  },
  accountVerification: {
    type: String,
    enum: ['Unverified', 'Pending', 'Verified', 'Declined'],
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
    enum: ['Demo', 'Active', 'Expired'],
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
    required: true
  }
}, { timestamps: true });

const artisanModel = mongoose.model('artisans', artisanSchema);

module.exports = artisanModel;















// const mongoose = require('mongoose');

// const artisanSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     unique: true,
//     trim: true
//   },
//   businessName: {
//     type: String,
//     unique: true,
//     trim: true
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     require: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: 'Artisan',
//   },
//   profilePic: {
//     public_id: { type: String },
//     image_url: { type: String }
//   },
//   coverPhoto: {
//     public_id: { type: String },
//     image_url: { type: String }
//   },
//   location: {
// <<<<<<< HEAD:models/artisans.js
//     number: {type: String},
//     street: {type: String},
//     lga: { type: String },
//     state: { type: String }
//   },
//   role: {
//     type: String,
//     enum: ['Admin', 'Artisan'],
//     default: 'Artisan',
// =======
//     number: { type: String, trim: true },
//     street: { type: String, trim: true },
//     lga: { type: String, trim: true },
//     state: { type: String, trim: true },
// >>>>>>> 61b3b3f74d10949d822ac2d28536f3ae7efbf8d3:models/artisan.js
//   },
//   accountVerification: {
//     type: String,
//     enum: ['Unverified', 'Pending', 'Verified', 'Declined'],
//     default: 'Unverified'
//   },
//   rating: {
//     type: Number,
//     default: 0
//   },
//   subscription: {
//     type: String,
//     enum: ['Demo', 'Active', 'Expired'],
//     default: 'Demo'
//   },
//   subscriptionPlan: {
//     type: String,
//     enum: ['Demo', 'Regular', 'Premium'],
//     default: 'Demo'
//   },
//   isLoggedIn: {
//     type: Boolean,
//     default: false
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   isRecommended: {
//     type: Boolean,
//     default: false
//   },
//   isRestricted: {
//     type: Boolean,
//     default: false
//   },
//   isSubscribed: {
//     type: Boolean,
//     default: false
//   },
//   expiresIn: {
//     type: Number,
//     require: true
//   },
// }, { timestamps: true });

// const artisanModel = mongoose.model('artisans', artisanSchema);

// module.exports = artisanModel;