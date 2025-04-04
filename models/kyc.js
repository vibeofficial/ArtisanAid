const mongoose = require('mongoose');


const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  },
  nin: {
    type: String,
    require: true
  },
  proofOfNIN: {
    public_id: { type: String, require: true },
    image_url: { type: String, require: true }
  },
  utilityBill: {
    public_id: { type: String, require: true },
    image_url: { type: String, require: true }
  },
  status: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending'
  }
}, { timestamps: true });

const kycModel = mongoose.model('kycs', kycSchema);

module.exports = kycModel;