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
  artisanName: {
    type: String,
    require: true
  },
  employerName: {
    type: String,
    require: true
  },
  employerEmail: {
    type: String,
    require: true
  },
  employerPhoneNumber: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true,
    trim: true
  },
  serviceDescription: {
    type: String,
    require: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Accepted', 'Rejected'],
    default: 'Applied'
  }
}, { timestamps: true });

const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;