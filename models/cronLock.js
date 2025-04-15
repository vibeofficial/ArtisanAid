const mongoose = require('mongoose');

const cronLockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CronLock', cronLockSchema);
