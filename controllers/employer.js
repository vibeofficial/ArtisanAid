const employerModel = require('../models/employer');
const artisanModel = require('../models/artisan');
const adminModel = require('../models/admin');
const jobPostModel = require('../models/jobPost');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.JWT_SECRET;


exports.registerEmployer = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, confirmPassword } = req.body;
    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      });
    };

    let emailExists = await adminModel.findOne({ email: email?.toLowerCase() });

    if (emailExists) {
      return res.status(400).json({
        message: `User with: ${email.toLowerCase()} already exist as an admin`
      })
    } else if (emailExists) {
      emailExists = await employerModel.findOne({ email: email?.toLowerCase() });

      return res.status(400).json({
        message: `User with: ${email.toLowerCase()} already exist as an employer`
      });
    } else if (!emailExists) {
      emailExists = await artisanModel.findOne({ email: email?.toLowerCase() });

      if (emailExists) {
        return res.status(400).json({
          message: `User with: ${email.toLowerCase()} already exist as an artisan`
        });
      }
    };

    let phonenUmberExists = await employerModel.findOne({ phoneNumber: phoneNumber });

    if (phonenUmberExists) {
      return res.status(400).json({
        message: `User with this phone number already exist as an employer`
      });
    } else if (!phonenUmberExists) {
      phonenUmberExists = await artisanModel.findOne({ phoneNumber: phoneNumber });

      if (phonenUmberExists) {
        return res.status(400).json({
          message: `User with this phone number already exist as an artisan`
        });
      }
    } else if (phonenUmberExists) {
      phonenUmberExists = await adminModel.findOne({ phoneNumber: phoneNumber });

      return res.status(400).json({
        message: `User with this phone number already exist as an admin`
      })
    };

    const profile = 'https://dentico.co.za/wp-content/uploads/2016/08/dummy-prod-1.jpg';
    const profilePicResult = await cloudinary.uploader.upload(profile);

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const employer = new employerModel({
      fullname: nameFormat,
      email,
      phoneNumber,
      password: hashedPassword,
      profilePic: {
        public_id: profilePicResult.public_id,
        image_url: profilePicResult.secure_url
      }
    });

    const token = jwt.sign({ id: employer._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `https://artisian-aid.vercel.app/verifyemail/${token}`;
    const html = verifyMail(link);

    const mailDetails = {
      email: employer.email,
      subject: 'EMAIL VERIFICATION',
      html
    };

    await mail_sender(mailDetails);
    await employer.save();

    res.status(201).json({
      message: 'Account Registered Successfully',
      data: employer
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ verificationStatus: 'Approved', subscription: { $in: ['Active', 'Free'] } });

    return res.status(200).json({
      message: 'Verified artisans retrieved successfully',
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        message: 'Please provide an email or phone number'
      });
    };

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    };

    let user;

    if (email) {
      user = await artisanModel.findOne({ email: email?.toLowerCase() }) || await employerModel.findOne({ email: email?.toLowerCase() }) || await adminModel.findOne({ email: email?.toLowerCase() });

      if (!user) {
        return res.status(404).json({ message: 'No account found' });
      };
    } else if (phoneNumber) {
      user = await artisanModel.findOne({ phoneNumber }) || await employerModel.findOne({ phoneNumber }) || await adminModel.findOne({ phoneNumber });

      if (!user) {
        return res.status(404).json({ message: 'No account found' });
      };
    };

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    };

    const jobPost = await jobPostModel.findOne({artisanId: user._id});

    if (!jobPost) {
      return res.status(404).json({
        message: 'Job post not found'
      })
    }

    if (user.isVerified !== true) {
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5m' });
      const link = `${req.protocol}://artisian-aid.vercel.app/verifyemail/${token}`;
      const html = verifyMail(link, user.fullname);

      const mailDetails = {
        email: user.email,
        subject: 'EMAIL VERIFICATION',
        html
      };

      await mail_sender(mailDetails);
      return res.status(401).json({
        message: 'Your account is not verified. A verification link has been sent to your email.'
      });
    }

    if (user.isRestricted === true) {
      return res.status(403).json({
        message: 'Your account is restricted. Contact: artisanaid.team@gmail.com to resolve'
      });
    }

    user.isLoggedIn = true;
    const token = jwt.sign({ id: user._id, role: user.role, isLoggedIn: user.isLoggedIn }, jwtSecret, { expiresIn: '1d' });
    await user.save();

    return res.status(200).json({
      message: 'Login successful',
      data: user,
      jobPostImage: jobPost,
      token
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.logout = async (req, res) => {
  try {
    const { id } = req.user;
    let user = await artisanModel.findById(id) || await employerModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(400).json({
        message: 'Account not found'
      });
    };

    if (user.isLoggedIn !== true) {
      return res.status(400).json({
        message: 'Account is already logged out'
      })
    };

    user.isLoggedIn = false;
    await user.save();

    return res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout Error:', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.getRecommendedArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ isRecommended: true, verificationStatus: 'Approved', subscription: { $in: ['Active', 'Free'] } });

    return res.status(200).json({
      message: 'Recommended artisans retrieved successfully',
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.getArtisansByCategory = async (req, res) => {
  try {
    const { nameOfCategory } = req.params;
    const artisans = await artisanModel.find({ category: nameOfCategory, verificationStatus: 'Approved', subscription: { $in: ['Active', 'Free'] } });

    res.status(200).json({
      message: "All artisans in this category",
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getArtisansByLocalGovt = async (req, res) => {
  try {
    const { lga } = req.body;

    const location = {
      lga,
      state: 'Lagos'
    };

    const artisans = await artisanModel.find({ location, verificationStatus: 'Approved', subscription: { $in: ['Active', 'Free'] } });

    return res.status(404).json({
      message: "All artisans in this lga",
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


exports.updateCoverPhoto = async (req, res) => {
  try {
    const { id } = req.user;
    const file = req.file;
    const user = await artisanModel.findById(id) || await employerModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const data = {
      coverPhoto: user.coverPhoto
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(data.coverPhoto.public_id);
      const coverPhotoResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.coverPhoto = {
        public_id: coverPhotoResult.public_id,
        image_url: coverPhotoResult.secure_url
      };

      let updatedCoverPhoto;

      if (user.role === 'Artisan') {
        updatedCoverPhoto = await artisanModel.findByIdAndUpdate(user._id, data, { new: true });
      } else if (user.role === 'Employer') {
        updatedCoverPhoto = await employerModel.findByIdAndUpdate(user._id, data, { new: true });
      } else if (user.role === 'Admin') {
        updatedCoverPhoto = await adminModel.findByIdAndUpdate(user._id, data, { new: true });
      }

      res.status(200).json({
        message: 'Profile picture updated successfully',
        data: updatedCoverPhoto
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