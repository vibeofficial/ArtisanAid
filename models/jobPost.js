const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'artisans'
  },
  amount: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  duration: {
    type: String,
    require: true
  }
});

const jpbPostModel = mongoose.model('jpbPosts', jobPostSchema);

module.exports = jpbPostModel;