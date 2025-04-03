const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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

const contactModel = mongoose.model('contacts', contactSchema);

module.exports = contactModel;