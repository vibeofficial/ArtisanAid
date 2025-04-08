const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
 fullname: {
  type: String,
  require: true
 },
 email: {
  type: String,
  require: true,
  lowercase: true
 },
 message: {
  type: String,
  require: true
 }
}, {timestamps: true});

const contactUsModel = mongoose.model('contactUs', contactUsSchema);

module.exports = contactUsModel;