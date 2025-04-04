const mongoose = require('mongoose');


const verificationSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  },
  workCertificate: {
    public_id: {type: String, require: true}, 
    image_url: {type: String, require: true} 
  },
  guarantorName: {
    type: String,
    require: true
  },
  guarantorPhoneNumber: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['Unverified','Pending', 'Verified', 'Declined'],
    default: 'Unverified'
  }
}, { timestamps: true });

const verificationModel = mongoose.model('verifications', verificationSchema);

module.exports = verificationModel;