const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'artisans'
  },
  jobImage: {
    public_id: { type: String, require: true },
    image_url: { type: String, require: true }
  }
});

const jobPostModel = mongoose.model('jobPosts', jobPostSchema);

module.exports = jobPostModel;