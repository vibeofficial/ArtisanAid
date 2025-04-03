const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, confirmEmail, businessName, phoneNumber, password, confirmPassword } = req.body;

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

    const emailExists = await userModel.findOne({ email: email?.toLowerCase() });

    if (emailExists) {
      return res.status(400).json({
        message: `User with email: ${email.toLowerCase()} already exist`
      });
    };

    const phoneNumberExists = await userModel.findOne({ phoneNumber: phoneNumber });

    if (phoneNumberExists) {
      return res.status(400).json({
        message: 'Phone number has already been used'
      });
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    let user;

    if (email === 'artisanaid.team@gmail.com') {
      user = new userModel({
        fullname: nameFormat,
        email,
        phoneNumber,
        password: hashedPassword,
        role: 'Admin',
        kycStatus: 'Approved',
        subscription: 'Unlimited',
        subscriptionPlan: 'Unlimited'
      });
    } else {
      user = new userModel({
        fullname: nameFormat,
        email,
        businessName,
        phoneNumber,
        password: hashedPassword,
        role: 'Artisan',
        kycStatus: 'Not yet',
        subscription: 'Demo',
        subscriptionPlan: 'Demo',
        expires: Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * 3),
      });
    };

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
    const html = verifyMail(link, user.businessName);

    const mailDetails = {
      email: user.email,
      subject: 'ACCOUNT VERIFICATION',
      html
    };

    await mail_sender(mailDetails);
    await user.save();

    res.status(201).json({
      message: 'Account Registered Successfully',
      data: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};


exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    jwt.verify(token, jwtSecret, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { userId } = jwt.decode(token);
          const user = await userModel.findById(userId);

          if (!user) {
            return res.status(404).json({
              message: 'User not found'
            })
          };

          if (user.isVerified === true) {
            return res.status(400).json({
              message: 'Account has already been verified'
            })
          };

          const newToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${newToken}`;
          const html = verifyMail(link, user.businessName);

          const mailDetails = {
            email: user.email,
            subject: 'RESEND: ACCOUNT VERIFICATION',
            html
          };

          await mail_sender(mailDetails);

          res.status(200).json({
            message: 'Session has expired, link has been sent to your email address'
          })
        };
      } else {
        const user = await userModel.findById(payload.userId);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        };

        if (user.isVerified === true) {
          return res.status(400).json({
            message: 'Account has already been verified'
          })
        };

        user.isVerified = true;
        await user.save();

        res.status(200).json({
          message: 'Account verified successfully'
        })
      }
    })
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session has expired'
      })
    };

    res.status(500).json({
      message: 'Error verifying user account'
    })
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/reset/password/${token}`; // Reset password url 
    const html = reset(link, user.businessName);

    const mailDetails = {
      email: user.email,
      subject: 'RESET YOUR PASSWORD',
      html
    };

    await mail_sender(mailDetails);

    res.status(200).json({
      message: 'Reset password link has been sent to email address'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error forgetting password'
    })
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const { userId } = jwt.verify(token, jwtSecret);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session has expired, re-enter your email address'
      })
    };

    res.status(500).json({
      message: 'Error resetting password'
    })
  }
};


exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    let user;

    if (email) {
      user = await userModel.findOne({ email: email?.toLowerCase() });

      if (!user) {
        return res.status(404).json({
          message: 'No account found'
        })
      }
    } else if (phoneNumber) {
      user = await userModel.findOne({ phoneNumber: phoneNumber });

      if (!user) {
        return res.status(404).json({
          message: 'No account found'
        })
      }
    };

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    if (user.isVerified !== true) {
      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '5mins' });
      const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
      const html = verifyMail(link, user.businessName);

      const mailDetails = {
        email: user.email,
        subject: 'ACCOUNT VERIFICATION',
        html
      };

      await mail_sender(mailDetails);
      return res.status(400).json({
        message: 'Your account is not verified, link has been sent to email address'
      })
    };

    if (user.isRestricted === true) {
      return res.status(400).json({
        message: 'Your account is restricted, contact: artisanaid.team@gmail.com to resolve'
      })
    };

    user.isLoggedIn = true;
    const token = jwt.sign({ userId: user._id, isLoggedIn: user.isLoggedIn, role: user.role }, jwtSecret, { expiresIn: '1day' });
    await user.save();

    res.status(200).json({
      message: 'Login successfully',
      token
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error logging user in'
    })
  }
};


exports.logout = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    user.isLoggedIn = false
    await user.save();

    res.status(200).json({
      message: 'Logout successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error logging user out'
    })
  }
};


exports.createAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    if (user.role === 'Admin') {
      return res.status(400).json({
        message: 'User is already an admin'
      })
    };

    if (user.isRestricted === true) {
      return res.status(400).json({
        message: 'User is restricted'
      })
    };

    user.role = 'Admin';
    user.kycStatus = 'Approved';
    user.subscription = 'Unlimited';
    user.subscriptionPlan = 'Unlimited';
    user.isRecommended = false;
    user.isSubscribed = false;
    user.expires = 0;
    await user.save();

    res.status(200).json({
      message: 'This user is now an admin'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error creating an admin'
    })
  }
};


exports.removeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (user.role === 'Artisan') {
      return res.status(404).json({
        message: 'User is not an admin'
      })
    };

    user.role = 'Artisan';
    user.kycStatus = 'Approved';
    user.subscription = 'Expired';
    user.subscriptionPlan = 'Regular';
    user.isRecommended = false;
    user.isSubscribed = false;
    user.expires = 0;
    await user.save();

    res.status(200).json({
      message: 'This user is no longer an admin'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error creating an admin'
    })
  }
};


exports.restrictAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (user.isRestricted === true) {
      return res.status(404).json({
        message: 'This account is already restricted'
      })
    };

    user.isRestricted = true;
    await user.save();

    res.status(200).json({
      message: 'Account is restricted successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error restricting account'
    })
  }
};


exports.unrestrictAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (user.isRestricted === false) {
      return res.status(404).json({
        message: 'This account is not restricted'
      })
    };

    user.isRestricted = false;
    await user.save();

    res.status(200).json({
      message: 'Account is no longer restricted'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error unrestricting account'
    })
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'Admin' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No user found'
      })
    };

    res.status(200).json({
      message: 'All admins',
      total: users.length,
      data: users
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


exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'User' } && { kycStatus: 'Approved' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No user found'
      })
    };

    res.status(200).json({
      message: 'All users',
      total: users.length,
      data: users
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error getting all users'
    })
  }
};


exports.getRecommendedUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'User' } && { isRecommended: true } && { kycStatus: 'Approved' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No recommended user found'
      })
    };

    res.status(200).json({
      message: 'All recommended users',
      total: users.length,
      data: users
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error getting all users'
    })
  }
};


exports.getUsersByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const users = await userModel.find({ role: 'Artisan' } && { category: category } && { kycStatus: 'Approved' });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No user found in this category",
      });
    };

    res.status(200).json({
      message: "All users in this category",
      total: users.length,
      data: users
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error getting users in category",
    });
  }
};


exports.getUsersByLocalGovt = async (req, res) => {
  try {
    const { lga } = req.body;
    const users = await userModel.find({ role: 'Artisan' } && { lga: lga } && { kycStatus: 'Approved' });

    if (users.length === 0) {
      return res.status(404).json({
        message: "All users in this lga",
        total: users.length,
        data: users
      });
    };
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching workers by local government",
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    res.status(200).json({
      message: 'User below',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error getting user'
    })
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, newPassword, confirmPassword } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

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
      })
    };

    res.status(500).json({
      message: 'Error changing password'
    })
  }
};


exports.updateProfilePic = async (req, res) => {
  try {
    const { userId } = req.user;
    const file = req.file;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      profilePic: user.profilePic
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
      const profilePicresult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.profilePic = {
        public_id: profilePicresult.public_id,
        image_url: profilePicresult.secure_url
      };

      const updatedProfilePic = await userModel.findByIdAndUpdate(user._id, data, { new: true });

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


exports.updateAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { lga, state } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      lga: lga,
      state: state
    };

    user.location = data;
    await user.save();

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


exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    };

    const deletedUser = await userModel.findByIdAndDelete(user._id);

    if (deletedUser) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    };

    res.status(200).json({
      message: 'Account deleted successfully'
    })
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