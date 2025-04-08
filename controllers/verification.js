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

    const exsistingGuarantorName = await verificationModel.findOne({ guarantorName: guarantorName });

    if (exsistingGuarantorName) {
      return res.status(400).json({
        message: 'Name has already being used to verify another account'
      })
    };

    const exsistingGuarantorPhoneNUmber = await verificationModel.findOne({ guarantorPhoneNumber: guarantorPhoneNumber });

    if (exsistingGuarantorPhoneNUmber) {
      return res.status(400).json({
        message: 'Phone number has already being used to verify another account'
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

    artisan.accountVerification = verification.status;
    await artisan.save();
    await verification.save();

    res.status(201).json({
      message: 'Account verification initialized successfully',
      data: verification
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error initializing verification'
    })
  }
};