const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    require: true
  },
  address: {
    number: { type: String },
    street: { type: String },
    lga: { type: String },
    state: { type: String }
  },
  password: {
    type: String,
    trim:true,
    required: true
  },
  profilePic: {
    public_id: { type: String },
    image_url: { type: String }
  },
  role: {
    type: String,
    default: 'Employer'
  },
  artisanId:{
    type:mongoose.SchemaTypes.ObjectId,
    ref: 'employers' , 
    require:true 
  },
  isVerified:{
    type: Boolean,
    default: false

  }
}, { timestamps: true });

const employerModel = mongoose.model('employers', employerSchema);

module.exports = employerModel;