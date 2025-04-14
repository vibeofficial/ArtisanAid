const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'artisans'
  },
  employerId: {
     type: mongoose.SchemaTypes.ObjectId,
    ref: 'employers'
  },
  purpose: {
    type: String,
    require: true
  }
});

const reportModel = mongoose.model('reports', reportSchema);

module.exports = reportModel;