const jobPostModel = require('../models/jobPost');
const artisanModel = require('../models/artisan');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');


exports.createJobPost = async (req, res) => {
  try {
    const { id } = req.user;
    const { description } = req.body;
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
      },
      description
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
        message: 'Session expired, please login to continue'
      })
    }
  }
};


exports.getAllJobPost = async (req, res) => {
  try {
    const jobPost = await jobPostModel.find().populate('artisanId', 'fullname businessName profilePic category accountVerification isRecommended rating');

    if (jobPost.length === 0) {
      return res.status(404).json({
        message: 'No artisan found'
      })
    };

    res.status(200).json({
      message: 'All artisans',
      data: jobPost
    })
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: 'Session expired, please login to continue'
    })
  }
};