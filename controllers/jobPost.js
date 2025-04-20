const jobPostModel = require('../models/jobPost');
const artisanModel = require('../models/artisan');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');


exports.createJobPost = async (req, res) => {
  try {
    const { id } = req.user;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Acoount not found'
      })
    };

    const jobPostExists = await jobPostModel.findOne({ artisanId: artisan._id });

    if (jobPostExists) {
      return res.status(400).json({
        message: 'Artisan can only create one job post'
      })
    }

    const file = req.file;

    const jobPostResult = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path);

    const jobPost = new jobPostModel({
      artisanId: artisan._id,
      jobImage: {
        public_id: jobPostResult.public_id,
        image_url: jobPostResult.secure_url
      }
    });

    await jobPost.save();
    artisan.jobPostId = jobPost._id;
    await artisan.save();
    res.status(201).json({
      message: 'Job Post created successfully'
    })
  } catch (error) {
    console.log(error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(500).json({
        message: error.message
      });

      return res.status(400).json({
        message: error.message
      })
    }
  }
};


exports.getAllJobPost = async (req, res) => {
  try {
    const jobPost = await jobPostModel.find().populate('artisanId', 'fullname businessName profilePic category accountVerification isRecommended rating');

    res.status(200).json({
      message: 'All artisans',
      data: jobPost
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message
    })
  }
};


exports.updateJobPost = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const { id } = req.user;
    const file = req.file;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const jobPost = await jobPostModel.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({
        message: 'No job post found'
      })
    };

    const data = {
      jobImage: jobPost.jobImage
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(data.jobImage.public_id);
      const jobImageResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.jobImage = {
        public_id: jobImageResult.public_id,
        image_url: jobImageResult.secure_url
      };

      const updatedJobPost = await jobPostModel.findByIdAndUpdate(jobPost._id, data, { new: true });
      res.status(200).json({
        message: 'Job post updated successfully'
      })
    }
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: error.message
    })
  }
};


exports.deleteJobPost = async (req, res) => {
  try {
    const { id } = req.user;
    const { jobPostId } = req.params;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const jobPost = await jobPostModel.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({
        message: 'No job post found'
      })
    };

    const deletedJobPost = await jobPostModel.findByIdAndDelete(jobPost._id);

    if (deletedJobPost) {
      await cloudinary.uploader.destroy(jobPost.jobImage.public_id);
    };

    res.status(200).json({
      message: 'Job post deleted successfully'
    })
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: error.message
    })
  }
};