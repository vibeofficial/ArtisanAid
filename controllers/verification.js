const verificationModel = require('../models/verification');
const artisanModel = require('../models/artisan');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');


exports.initializeVerification = async (req, res) => {
  try {
    const { id } = req.user;
    const artisan = await artisanModel.findById(id);
    const { guarantorName, guarantorPhoneNumber } = req.body;

    const file = req.file;
    const certificateResult = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan account not found'
      })
    };

    const guarantor_name = guarantorName?.split(' ');
    const nameFormat = guarantor_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    const verification = new verificationModel({
      guarantorName: nameFormat,
      guarantorPhoneNumber,
      artisanId: artisan._id,
      artisanName: artisan.fullname,
      workCertificate: {
        public_id: certificateResult.public_id,
        image_url: certificateResult.secure_url
      }
    });

    await verification.save();

    artisan.verificationId = verification._id;
    artisan.accountVerification = verification.status;
    await artisan.save();

    res.status(201).json({
      message: 'Account verification initialized successfully',
      data: verification
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.acceptVerification = async (req, res) => {
  try {
    const {id} = req.user;

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};