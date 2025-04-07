const employerModel = require('../models/employer');
const artisanModel = require('../models/artisan');
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.JWT_SECRET;


exports.registerAdmin = async (req, res) => {
  try {
    const { fullname, phoneNumber, email, password, confirmPassword } = req.body;
    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      });
    };

    const emailExists = await adminModel.findOne({ email: email?.toLowerCase() });

    if (emailExists) {
      return res.status(400).json({
        message: `Admin with ${email.toLowerCase()} already exists`
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const admin = new adminModel({
      fullname: nameFormat,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: 'Account registered successully',
      data: admin
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error registering admin' });
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();

    if (admins.length === 0) {
      return res.status(404).json({
        message: 'No admin found'
      })
    };

    res.status(200).json({
      message: 'All admins',
      total: admins.length,
      data: admins
    })
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: 'Error getting all admin'
    })
  }
};


exports.restrictAccount = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await artisanModel.findById(id) ||
      await employerModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    };

    if (user.isRestricted === true) {
      return res.status(400).json({
        message: 'This account is already restricted'
      });
    };

    user.isRestricted = true;
    await user.save();

    return res.status(200).json({
      message: 'Account restricted successfully'
    });

  } catch (error) {
    console.error('Restrict Error:', error.message);
    return res.status(500).json({
      message: 'Error restricting account'
    });
  }
};


exports.unrestrictAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find user in artisan, employer, or admin model
    let user = await artisanModel.findById(id) ||
      await employerModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!user.isRestricted) {
      return res.status(400).json({
        message: 'This account is not currently restricted'
      });
    }

    user.isRestricted = false;
    await user.save();

    return res.status(200).json({
      message: 'Account unrestricted successfully'
    });

  } catch (error) {
    console.error('Unrestrict Error:', error.message);
    return res.status(500).json({
      message: 'Error unrestricting account'
    });
  }
};


exports.getArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ accountVerification: 'Verified' });

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({
        message: 'No verified artisans found'
      });
    }

    return res.status(200).json({
      message: 'Verified artisans retrieved successfully',
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error('Get Artisans Error:', error.message);
    return res.status(500).json({
      message: 'Error retrieving artisans'
    });
  }
};


exports.getEmployers = async (req, res) => {
  try {
    const employers = await employerModel.find({ isVerified: true });

    if (employers.length === 0) {
      return res.status(404).json({
        message: 'No verified employers found'
      });
    }

    return res.status(200).json({
      message: 'Verified employers retrieved successfully',
      total: employers.length,
      data: employers
    });
  } catch (error) {
    console.error('Get Artisans Error:', error.message);
    return res.status(500).json({
      message: 'Error retrieving employers'
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await employerModel.findById(id) || await artisanModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'User details found',
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error retrieving user',
    });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }
    };

    if (user.role === 'Artisan') {
      const deletedUser = await artisanModel.findByIdAndDelete(user._id);

      if (deletedUser) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      };

      res.status(200).json({
        message: 'Account deleted successfully'
      })
    } else if (user.role === 'Employer') {
      const deletedUser = await employerModel.findByIdAndDelete(user._id);

      if (deletedUser) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      };

      res.status(200).json({
        message: 'Account deleted successfully'
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
      message: 'Error deleting account'
    })
  }
};