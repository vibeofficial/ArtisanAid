const employerModel = require('../models/employer');
const artisanModel = require('../models/artisan');
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail } = require('../helper/emailTemplate');
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

    const cover = 'http://www.listercarterhomes.com/wp-content/uploads/2013/11/dummy-image-square.jpg';
    const coverPhotoResult = await cloudinary.uploader.upload(cover);

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const admin = new adminModel({
      fullname: nameFormat,
      phoneNumber,
      email,
      password: hashedPassword,
      profilePic: {
        public_id: profilePicResult.public_id,
        image_url: profilePicResult.secure_url
      },
      coverPhoto: {
        public_id: coverPhotoResult.public_id,
        image_url: coverPhotoResult.secure_url
      }
    });

    const token = jwt.sign({ id: admin._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `https://artisian-aid.vercel.app/verifyemail/${token}`;

    const html = verifyMail(link);

    const mailDetails = {
      email: admin.email,
      subject: 'EMAIL VERIFICATION',
      html
    };

    await mail_sender(mailDetails);
    await admin.save();

    res.status(201).json({
      message: 'Account registered successully',
      data: admin
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registering admin' });
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({ isVerified: true });

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
      message: error.message
    })
  }
};


exports.getUnVerifiedArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ verificationStatus: 'Unverified' });

    return res.status(200).json({
      message: 'Unverified artisans retrieved successfully',
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


exports.getPendingArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ verificationStatus: 'Pending' }).populate('verificationId');

    return res.status(200).json({
      message: 'Pending artisans retrieved successfully',
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


exports.getApprovedArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ verificationStatus: 'Approved' }).populate('verificationId');

    return res.status(200).json({
      message: 'Approved artisans retrieved successfully',
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


exports.getDeclinedArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ verificationStatus: 'Declined' }).populate('verificationId');

    return res.status(200).json({
      message: 'Declined artisans retrieved successfully',
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


exports.getEmployers = async (req, res) => {
  try {
    const employers = await employerModel.find({ isVerified: true });

    return res.status(200).json({
      message: 'Verified employers retrieved successfully',
      total: employers.length,
      data: employers
    });
  } catch (error) {
    console.error('Get Artisans Error:', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await employerModel.findById(id) || await artisanModel.findById(id).populate('verificationId') || await adminModel.findById(id);

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
      message: error.message
    });
  }
};


exports.getReportedArtisan = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ isReported: true });

    res.status(200).json({
      message: 'Reported artisans below',
      data: artisans
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


exports.restrictAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { artisanId } = req.params;
    const { reason } = req.body;

    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    const artisan = await artisanModel.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      });
    };

    if (artisan.isRestricted === true) {
      return res.status(400).json({
        message: 'This account is already restricted'
      });
    };

    const mailDetails = {
      email: artisan.email,
      subject: 'ACCOUNT RESTRICTION',
      html: reason
    };

    await mail_sender(mailDetails);
    artisan.isRestricted = true;
    await artisan.save();

    return res.status(200).json({
      message: 'Account restricted successfully'
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.unrestrictAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { artisanId } = req.params;

    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    const artisan = await artisanModel.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      });
    };

    artisan.isRestricted = false;
    await artisan.save();

    return res.status(200).json({
      message: 'Account unrestricted successfully'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await artisanModel.findById(id) || await employerModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
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
      message: error.message
    })
  }
}; 