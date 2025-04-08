const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    require: true
  },
  planId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'plans',
  },
  fullname: {
    type: String,
    require: true
  },
  businessName: {
    type: String,
    require: true
  },
  plan: {
    type: String,
    require: true
  },
  amount: {
    type: String,
    require: true
  },
  duration: {
    type: String,
    require: true
  },
  reference: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending'
  },
  subscriptionDate: {
    type: String,
    require: true,
    default: 'Processing'
  },
  expiresIn: {
    type: Number,
    require: true,
    default: 0
  }
});

const subscriptionModel = mongoose.model('subscriptions', subscriptionSchema);

module.exports = subscriptionModel;