const artisanModel = require('../models/artisan');
const employerModel = require('../models/employers');
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.JWT_SECRET;

exports.registerArtisan = async (req, res) => {
  try {
    const { fullname, email, businessName, phoneNumber, category, password, confirmPassword } = req.body;

    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    const business_name = businessName.split(' ');
    const bnameFormat = business_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      });
    };

    const emailExists = await artisanModel.findOne({ email: email?.toLowerCase() });

    if (emailExists) {
      return res.status(400).json({
        message: `Artisan with email: ${email.toLowerCase()} already exist`
      });
    };

    const phoneNumberExists = await artisanModel.findOne({ phoneNumber: phoneNumber });

    if (phoneNumberExists) {
      return res.status(400).json({
        message: 'Phone number has already been used'
      });
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const artisan = new artisanModel({
      fullname: nameFormat,
      email,
      businessName: bnameFormat,
      phoneNumber,
      category,
      password: hashedPassword,
      expiresIn: Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * 3),
    });

    const token = jwt.sign({ id: artisan._id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
    const html = verifyMail(link, artisan.businessName);

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
    res.status(500).json({ message: 'Error registering artisan' });
  }
};


exports.verifyAccount = async (req, res) => {
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
          const { id } = jwt.decode(token);
          let user = await artisanModel.findById(id);

          if (!user) {
            user = await employerModel.findById(id);

            if (!user) {
              user = await adminModel.findById(id);

              if (!user) {
                return res.status(404).json({
                  message: 'User not found'
                })
              }
            }
          };

          if (user.isVerified === true) {
            return res.status(400).json({
              message: 'Account has already been verified'
            })
          };

          const newToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
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
        let user = await artisanModel.findById(payload.id);

        if (!user) {
          user = await employerModel.findById(payload.id);

          if (!user) {
            user = await adminModel.findById(payload.id);

            if (!user) {
              return res.status(404).json({
                message: 'User not found'
              })
            }
          }
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
      message: "Error verifying user's account"
    })
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await artisanModel.findOne({ email: email });

    if (!user) {
      user = await employerModel.findOne({ email: email });

      if (!user) {
        user = await adminModel.findOne({ email: email });

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
    };

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
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

    const { id } = jwt.verify(token, jwtSecret);
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
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
      user = await artisanModel.findOne({ email: email?.toLowerCase() });

      if (!user) {
        user = await employerModel.findOne({ email: email?.toLowerCase() });

        if (!user) {
          user = await adminModel.findOne({ email: email?.toLowerCase() });

          if (!user) {
            return res.status(404).json({
              message: 'No account found'
            })
          }
        }
      }
    } else if (phoneNumber) {
      user = await artisanModel.findOne({ phoneNumber: phoneNumber });

      if (!user) {
        user = await employerModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
          user = await adminModel.findOne({ phoneNumber: phoneNumber });

          if (!user) {
            return res.status(404).json({
              message: 'No account found'
            })
          }
        }
      }
    };

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    if (user.isVerified !== true) {
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5mins' });
      const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
      const html = verifyMail(link, user.businessName);

      const mailDetails = {
        email: user.email,
        subject: 'ACCOUNT VERIFICATION',
        html
      };

      await mail_sender(mailDetails);
      return res.status(401).json({
        message: 'Your account is not verified, link has been sent to email address'
      })
    };

    if (user.isRestricted === true) {
      return res.status(400).json({
        message: 'Your account is restricted, contact: artisanaid.team@gmail.com to resolve'
      })
    };

    user.isLoggedIn = true;
    const token = jwt.sign({ id: user._id, isLoggedIn: user.isLoggedIn, role: user.role }, jwtSecret, { expiresIn: '1day' });
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
    const { id } = req.user;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
    };

    user.isLoggedIn = false
    await user.save();

    res.status(200).json({
      message: 'Logout successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error logging artisan out'
    })
  }
};


exports.restrictAccount = async (req, res) => {
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


exports.getArtisans = async (req, res) => {
  try {
    const artisans = await artisanModel.find({ accountVerification: 'Verified' });

    if (artisans.length === 0) {
      return res.status(404).json({
        message: 'No artisan found'
      })
    };

    res.status(200).json({
      message: 'All artisans',
      total: artisans.length,
      data: artisans
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error getting all artisans'
    })
  }
};


exports.getRecommendedArtisans = async (req, res) => {
  try {
    const users = await artisanModel.find({ role: 'Artisan' } && { isRecommended: true } && { accountVerification: 'Verified' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No recommended artisan found'
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


exports.getArtisansByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const artisans = await artisanModel.find({ category: category });

    if (artisans.length === 0) {
      return res.status(404).json({
        message: "No artisan found in this category",
      });
    };

    res.status(200).json({
      message: "All artisans in this category",
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error getting artisans in category",
    });
  }
};


exports.getArtisansByLocalGovt = async (req, res) => {
  try {
    const { lga } = req.body;

    const location = { lga, state }
    const artisans = await artisanModel.find({ location: location } && { accountVerification: 'Verified' });

    if (artisans.length === 0) {
      return res.status(404).json({
        message: "All artisans in this lga",
        total: artisans.length,
        data: artisans
      });
    };
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching artisans by local government",
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
    };

    res.status(200).json({
      message: 'User below',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error getting artisan'
    })
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword, confirmPassword } = req.body;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
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
    const { id } = req.user;
    const file = req.file;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
    };

    const data = {
      profilePic: user.profilePic
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
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
      }

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


exports.updateCoverPhoto = async (req, res) => {
  try {
    const { id } = req.user;
    const file = req.file;
    let user = await artisanModel.findById(id);

    if (!user) {
      user = await employerModel.findById(id);

      if (!user) {
        user = await adminModel.findById(id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          })
        }
      }
    };

    const data = {
      coverPhoto: user.coverPhoto
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(user.coverPhoto.public_id);
      const coverPhotoResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.profilePic = {
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
      message: 'Error updating cover photo'
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


exports.deleteUser = async (req, res) => {
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