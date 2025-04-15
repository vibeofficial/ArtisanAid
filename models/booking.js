const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'employers'
  },
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'artisans'
  },
  location: {
    type: String,
    require: true,
    trim: true
  },
  serviceTitle: {
    type: String,
    require: true,
    trim: true
  },
  serviceDescription: {
    type: String,
    require: true,
    trim: true
  },
  date: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;