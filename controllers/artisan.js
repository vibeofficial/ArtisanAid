const artisanModel = require('../models/artisan');
const employerModel = require('../models/employer');
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, resetPassword } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.JWT_SECRET;



exports.registerArtisan = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, businessName, confirmPassword, category } = req.body;
    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    const business_name = businessName.split(' ');
    const bNameFormat = business_name?.map((e) => {
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

    const businessNameExists = await artisanModel.findOne({ businessName: businessName });

    if (businessNameExists) {
      return res.status(404).json({
        message: `User with: ${businessName} name already exists`
      })
    };

    const profile = 'https://dentico.co.za/wp-content/uploads/2016/08/dummy-prod-1.jpg';
    const profilePicResult = await cloudinary.uploader.upload(profile);

    const cover = 'http://www.listercarterhomes.com/wp-content/uploads/2013/11/dummy-image-square.jpg';
    const coverPhotoResult = await cloudinary.uploader.upload(cover);

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const artisan = new artisanModel({
      fullname: nameFormat,
      email,
      businessName: bNameFormat,
      phoneNumber,
      category,
      password: hashedPassword,
      expiresIn: Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * 3),
      profilePic: {
        public_id: profilePicResult.public_id,
        image_url: profilePicResult.secure_url
      },
      coverPhoto: {
        public_id: coverPhotoResult.public_id,
        image_url: coverPhotoResult.secure_url
      }
    });

    const token = jwt.sign({ id: artisan._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://artisian-aid.vercel.app/verifyemail/${token}`;
    const html = verifyMail(link);

    const mailDetails = {
      email: artisan.email,
      subject: 'ACCOUNT VERIFICATION',
      html
    };

    await mail_sender(mailDetails);
    await artisan.save();

    res.status(201).json({
      message: 'Account Registered Successfully',
      data: artisan
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    };

    jwt.verify(token, jwtSecret, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { id } = jwt.decode(token);
          const user = await artisanModel.findById(id) || await employerModel.findById(id) || await adminModel.findById(id);

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          };

          if (user.isVerified) {
            return res.status(400).json({ message: 'Account has already been verified' });
          };

          const newToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
          const link = `${req.protocol}://artisian-aid.vercel.app/verifyemail/${newToken}`;
          const html = verifyMail(link);

          const mailDetails = {
            email: user.email,
            subject: 'RESEND: ACCOUNT VERIFICATION',
            html
          };

          await mail_sender(mailDetails);
          return res.status(200).json({
            message: 'Session expired. A new verification link has been sent to your email address'
          });
        }
      } else {
        const user = await artisanModel.findById(payload.id) || await employerModel.findById(payload.id) || await adminModel.findById(payload.id);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        };

        if (user.isVerified) {
          return res.status(400).json({ message: 'Account has already been verified' });
        };

        user.isVerified = true;
        await user.save();

        res.status(200).json({
          message: 'Email verified successfully'
        });
      }
    });
  } catch (error) {
    console.error('Verification Error:', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.resendVerifyLink = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await artisanModel.findOne({ email: email?.toLowerCase() }) || await employerModel.findOne({ email: email?.toLowerCase() }) || await adminModel.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://artisian-aid.vercel.app/verifyemail/${token}`;
    const html = verifyMail(link);

    const mailDetails = {
      email: user.email,
      subject: 'ACCOUNT VERIFICATION',
      html
    };

    await mail_sender(mailDetails);

    res.status(201).json({
      message: 'Link has been sent to email address'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Error sending mail'
    });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    };

    const user = await artisanModel.findOne({ email: email?.toLowerCase() }) || await employerModel.findOne({ email: email?.toLowerCase() }) || await adminModel.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    };

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/reset/password/${token}`;//hosted url
    const html = resetPassword(link);

    const mailDetails = {
      email: user.email,
      subject: 'RESET YOUR PASSWORD',
      html
    };

    await mail_sender(mailDetails);

    return res.status(200).json({
      message: `Link to reset password has been sent to ${user.email}`
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Error processing password reset'
    });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    };

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Password do not match' });
    };

    const { id } = await jwt.verify(token, jwtSecret);
    const user = await artisanModel.findById(id) || await employerModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    };

    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword, confirmPassword } = req.body;

    const user = await artisanModel.findById(id) || await employerModel.findById(id) || await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    };

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password do not match'
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      });
    };

    res.status(500).json({
      message: 'Error changing password'
    });
  }
};


exports.updateProfilePic = async (req, res) => {
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
      profilePic: user.profilePic
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(data.profilePic.public_id);
      const profilePicResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.profilePic = {
        public_id: profilePicResult.public_id,
        image_url: profilePicResult.secure_url
      };

      let updatedProfilePic;

      if (user.role === 'Artisan') {
        updatedProfilePic = await artisanModel.findByIdAndUpdate(user._id, data, { new: true });
      } else if (user.role === 'Employer') {
        updatedProfilePic = await employerModel.findByIdAndUpdate(user._id, data, { new: true });
      } else if (user.role === 'Admin') {
        updatedProfilePic = await adminModel.findByIdAndUpdate(user._id, data, { new: true });
      };

      res.status(200).json({
        message: 'Profile picture updated successfully',
        data: updatedProfilePic
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
      message: 'Error updating profile picture'
    })
  }
};


exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.user;
    const { number, street, lga, state } = req.body;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }
    };

    const data = {
      location: user.location
    };

    data.location = {
      number,
      street,
      lga,
      state
    };

    let updatedLocation;

    if (user.role === 'Employer') {
      updatedLocation = await employerModel.findByIdAndUpdate(user._id, data, { new: true })
    } else if (user.role === 'Artisan') {
      updatedLocation = await artisanModel.findByIdAndUpdate(user._id, data, { new: true })
    }

    res.status(200).json({
      message: 'Location updated successfully'
    })
  } catch (error) {
    console.log(error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: 'Error updating address'
    })
  }
};


exports.updateBio = async (req, res) => {
  try {
    const { id } = req.user;
    const { bio } = req.body;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      bio: artisan.bio
    };

    data.bio = {
      bio
    };

    const updatedBio = await artisanModel.findByIdAndUpdate(artisan._id, data, { new: true });

    res.status(200).json({
      message: 'Bio updated successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error updating bio'
    })
  }
};