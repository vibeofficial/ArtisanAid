const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  age: {
    type: String, 
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
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
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  category: {
    type: String, // Allows users to input their job type freely
    required: true
  },
  address: {
    lga: {
       type: String, 
       required: true // Used in querying workers by local government
      }, 
    state: 
    { type: String, 
      required: true 
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
  },
  subscriptionId: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'subscriptions'
  }]
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;












































// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     require: true
//   },
//   email: {
//     type: String,
//     require: true,
//     lowercase: true
//   },
//   username: {
//     type: String,
//     require: true,
//     lowercase: true
//   },
//   gender: {
//     type: String,
//     require: true,
//     enum: ['Male', 'Female']
//   },
//   age: {
//     type: String,
//     require: true,
//   },
//   phoneNumber: {
//     type: String,
//     require: true,
//   },
//   password: {
//     type: String,
//     require: true,
//   },
//   profilePic: {
//     public_id: { type: String },
//     image_url: { type: String }
//   },
//   role: {
//     type: String,
//     enum: ['Admin', 'User'],
//     default: 'User'
//   },
//   category: {
//     type: String,
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
//   expires: {
//     type: Number,
//     default: 0
//   },
//   subscription: {
//     type: String,
//     enum: ['Unlimited', 'Demo', 'Active', 'Expired'],
//   },
//   subscriptionId: [{
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'subscriptions'
//   }]
// }, { timestamps: true });

// const userModel = mongoose.model('users', userSchema);

// module.exports = userModel;