const employersModel = require('../models/employers');
const artisansModel = require('../models/artisan')
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.SECRET;

exports.registerEmployer = async (req, res) => {
  try {
    const { fullname, email, confirmEmail, phoneNumber, address, password, confirmPassword } = req.body;

    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      });
    };

    if (email !== confirmEmail) {
      return res.status(400).json({
        message: 'Email does not match'
      });
    };

    const emailExists = await employersModel.findOne({ email: email?.toLowerCase() });

    if (emailExists) {
      return res.status(400).json({
        message: `User with email: ${email.toLowerCase()} already exist`
      });
    };

    const phoneNumberExists = await employersModel.findOne({ phoneNumber: phoneNumber });

    if (phoneNumberExists) {
      return res.status(400).json({
        message: 'Phone number has already been used'
      });
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);
    const newEmployer = new employersModel ({
        fullName:nameFormat,
        email: email.trim(),
        phoneNumber,
        address,
        password:hashedPassword,
        role:'Employer'

    })

    const token = jwt.sign({ userId: newEmployer._id }, process.env.SECRET, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
    const html = verifyMail(link, nameFormat);

    const mailDetails = {
      email: newEmployer.email,
      subject: 'ACCOUNT VERIFICATION',
      html
    };

    await mail_sender(mailDetails);
    await newEmployer.save();

    res.status(201).json({
      message: 'Account Registered Successfully',
      data: newEmployer
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};


exports.getArtisanById = async (req, res) => {
  try {
    const { artisanId } = req.params; // Get artisan ID from URL
    const artisan = await artisansModel.findOne({ _id: artisanId, role: 'artisan' } && { accountVerification: 'verified'}).select('-password');
    // Find the user with the provided ID and confirm the role is 'artisan'

    if (!artisan) {
      return res.status(404).json({ 
        message: 'Artisan not found'
       });
    }

    res.status(200).json({
      message: 'Artisan retrieved successfully',
      data: artisan
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ 
      message: 'Failed to retrieve artisan', 
       });
  }
};
exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await artisansModel.find({ role: 'artisan' } && { accountVerification: 'Verified' }).select('-password')
    if (artisans.length < 1) {
      return res.status(404).jason({
        message: 'No artisan found'
      })
    }
    res.status(200).json({
      message: 'All artisans retrieved successfully',
      count: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ 
      message: 'Failed to retrieve artisans', 
     });
  }
};

