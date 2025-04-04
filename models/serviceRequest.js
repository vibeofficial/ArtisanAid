const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true,
        ref:'users'
    },
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    }, 
    gender: {
        type: String,
        require: true
    },
    serviceRequired: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accept', 'Decline'],
        default: 'Pending'
    }
});

const serviceRequestModel = mongoose.model('serviceRequests', serviceRequestSchema);

module.exports = serviceRequestModel;










