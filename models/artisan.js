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
//     required: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     default: 'Artisan'
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
//     number: { type: String, trim: true },
//     street: { type: String, trim: true },
//     lga: { type: String, trim: true },
//     state: { type: String, trim: true }
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['Unverified', 'In Progress', 'Verified', 'Declined'],
//     default: 'Unverified'
//   },
//   bio: {
//     type: String,
//     trim: true
//   },
//   socialMediaLink: {
//     type: String,
//     trim: true
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
//     enum: ['Demo', 'Basic Plan', 'Premium Plan'],
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
//   isReported: {
//     type: Boolean,
//     default: false
//   },
//   isSubscribed: {
//     type: Boolean,
//     default: false
//   },
//   expiresIn: {
//     type: Number,
//     required: true
//   },
//   jobPostId: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'jobPosts'
//   }
// }, { timestamps: true });

// const artisanModel = mongoose.model('artisans', artisanSchema);

// module.exports = artisanModel;



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
    number: { type: String, trim: true },
    street: { type: String, trim: true },
    lga: { type: String, trim: true },
    state: { type: String, trim: true }
  },
  verificationStatus: {
    type: String,
    enum: ['Unverified', 'In Progress', 'Verified', 'Declined'],
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
    enum: ['Demo', 'Basic Plan', 'Premium Plan'],
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
  isReported: {
    type: Boolean,
    default: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },

  // NEW: Date the artisan was registered (used for subscription start)
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },

  // NEW: Date when the current subscription ends
  subscriptionEndDate: {
    type: Date
  },

  // NEW: Whether artisan is still in the free 3-month trial
  isTrialActive: {
    type: Boolean,
    default: true
  },

  // REPLACED: This field was vague—`expiresIn` is better handled using `subscriptionEndDate`
  // expiresIn: { type: Number, required: true }, //  REMOVE THIS LINE

  // OPTIONAL: Track paid subscriptions (can be expanded for Paystack/Stripe later)
  paymentHistory: [
    {
      amount: Number,
      date: Date,
      transactionId: String,
      method: String
    }
  ],

  jobPostId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'jobPosts'
  }
}, { timestamps: true });

const artisanModel = mongoose.model('artisans', artisanSchema);

module.exports = artisanModel;
