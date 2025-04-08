const mongoose = require('mongoose');


const verificationSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  },
  artisanName: {
    type: String,
    require: true
  },
  workCertificate: {
    public_id: { type: String, require: true },
    image_url: { type: String, require: true }
  },
  guarantorName: {
    type: String,
    require: true,
    trim: true
  },
  guarantorPhoneNumber: {
    type: String,
    require: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Declined'],
    default: 'Pending'
  }
}, { timestamps: true });

const verificationModel = mongoose.model('verifications', verificationSchema);

module.exports = verificationModel;