const artisanModel = require('../models/artisan');
const employerModel = require('../models/employers');
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.SECRET;

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
      return res.status(404).json({ message: 'Token not found' });
    }

    // Try to verify the token
    jwt.verify(token, process.env.SECRET, async (error, payload) => {
      let user;

      if (error) {
        // Token invalid or expired
        if (error instanceof jwt.JsonWebTokenError) {
          const decoded = jwt.decode(token); // decode to get user ID
          const userId = decoded?.id;

          if (!userId) {
            return res.status(400).json({ message: 'Invalid token structure' });
          }

          // Try to find user in all models
          user = await artisanModel.findById(userId) ||
                 await employerModel.findById(userId) ||
                 await adminModel.findById(userId);

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          // If user already verified
          if (user.isVerified) {
            return res.status(400).json({ message: 'Account has already been verified' });
          }

          // Generate new token and resend email
          const newToken = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${newToken}`;
          const html = verifyMail(link, user.fullName || user.businessName || user.nameFormat || 'User');

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

        // Other JWT errors
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // If token is valid
      const userId = payload?.id;

      user = await artisanModel.findById(userId) ||
             await employerModel.findById(userId) ||
             await adminModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Account has already been verified' });
      }

      // Update verification status
      user.isVerified = true;
      await user.save();

      return res.status(200).json({ message: 'Account verified successfully' });
    });
  } catch (error) {
    console.error('Verification Error:', error.message);

    return res.status(500).json({
      message: 'Error verifying account'
    });
  }
};




exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await artisanModel.findOne({ email: email.toLowerCase() }) ||
                 await employersModel.findOne({ email: email.toLowerCase() }) ||
                 await adminModel.findOne({ email: email.toLowerCase() });

    if (!user || !['artisan', 'employer', 'admin'].includes(user.role.toLowerCase())) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Generate reset token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/reset/password/${token}`;

    const name = user.nameFormat || user.businessName || user.fullName || 'User';
    const html = reset(link, name);

    const mailDetails = {
      email: user.email,
      subject: 'RESET YOUR PASSWORD',
      html
    };

    await mail_sender(mailDetails);

    return res.status(200).json({
      message: 'Reset password link has been sent to your email address'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error.message);
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
      return res.status(400).json({ message: 'Token not found' });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Both password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Session has expired, re-enter your email address' });
    }

    let user = await artisanModel.findById(payload.id) ||
               await employersModel.findById(payload.id) ||
               await adminModel.findById(payload.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Reset Password Error:', error.message);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        message: 'Please provide an email or phone number'
      });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let user;

    if (email) {
      user = await artisanModel.findOne({ email: email.toLowerCase() }) ||
             await employersModel.findOne({ email: email.toLowerCase() }) ||
             await adminModel.findOne({ email: email.toLowerCase() });
    } else if (phoneNumber) {
      user = await artisanModel.findOne({ phoneNumber }) ||
             await employersModel.findOne({ phoneNumber }) ||
             await adminModel.findOne({ phoneNumber });
    }

    if (!user) {
      return res.status(404).json({ message: 'No account found' });
    }

    if (!['artisan', 'employer', 'admin'].includes(user.role.toLowerCase())) {
      return res.status(403).json({
        message: `Login not allowed for user role: ${user.role}`
      });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Account verification check
    if (user.isVerified !== true) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5m' });
      const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
      const html = verifyMail(link, user.fullName || user.businessName || user.nameFormat || 'User');

      const mailDetails = {
        email: user.email,
        subject: 'ACCOUNT VERIFICATION',
        html
      };

      await mail_sender(mailDetails);
      console.log('Verification email sent to:', user.email);

      return res.status(401).json({
        message: 'Your account is not verified. A verification link has been sent to your email.'
      });
    }

    // Account restriction check
    if (user.isRestricted === true) {
      return res.status(403).json({
        message: 'Your account is restricted. Contact: artisanaid.team@gmail.com to resolve'
      });
    }

    // All good — issue login token
    user.isLoggedIn = true;
    const loginToken = jwt.sign(
      { id: user._id, role: user.role, isLoggedIn: true },
      process.env.SECRET,
      { expiresIn: '1d' }
    );
    await user.save();

    return res.status(200).json({
      message: 'Login successful',
      loginToken
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      message: 'Error logging in'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        message: 'User is not logged in'
      });
    }

    // Try to find user from artisan, employer, or admin models
    let user = await artisanModel.findById(id) ||
               await employerModel.findById(id) ||
               await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check for acceptable roles
    if (!['artisan', 'employer', 'admin'].includes(user.role?.toLowerCase())) {
      return res.status(403).json({
        message: 'Invalid user role'
      });
    }

    // Log out user
    user.isLoggedIn = false;
    await user.save();

    return res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout Error:', error.message);
    return res.status(500).json({
      message: 'Error logging user out'
    });
  }
};





exports.createAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    if (artisan.role === 'Admin') {
      return res.status(400).json({
        message: 'Artisan is already an admin'
      })
    };

    if (artisan.isRestricted === true) {
      return res.status(400).json({
        message: 'Artisan is restricted'
      })
    };

    artisan.role = 'Admin';
    artisan.accountVerification = 'Verified';
    artisan.subscription = 'Unlimited';
    artisan.subscriptionPlan = 'Unlimited';
    artisan.isRecommended = false;
    artisan.isSubscribed = false;
    artisan.expires = 0;
    await artisan.save();

    res.status(200).json({
      message: 'This artisan is now an admin'
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
    const { id } = req.params;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (artisan.role === 'Artisan') {
      return res.status(404).json({
        message: 'Artisan is not an admin'
      })
    };

    artisan.role = 'Artisan';
    artisan.accountVerification = 'Verified';
    artisan.subscription = 'Expired';
    artisan.subscriptionPlan = 'Regular';
    artisan.isRecommended = false;
    artisan.isSubscribed = false;
    artisan.expires = 0;
    await artisan.save();

    res.status(200).json({
      message: 'This artisan is no longer an admin'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error removing an admin'
    })
  }
};
exports.restrictAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user in both artisan and employer models
    let user = await artisanModel.findById(id) ||
               await employerModel.findById(id) 
              
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (user.isRestricted === true) {
      return res.status(400).json({
        message: 'This account is already restricted'
      });
    }

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



exports.getRecommendedArtisans = async (req, res) => {
  try {
    const users = await artisanModel.find({
      role: 'Artisan',
      isRecommended: true,
      accountVerification: 'Verified'
    });

    if (!users || users.length < 1) {
      return res.status(404).json({
        message: 'No recommended artisan found'
      });
    }

    return res.status(200).json({
      message: 'Recommended artisans retrieved successfully',
      total: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get Recommended Artisans Error:', error.message);
    return res.status(500).json({
      message: 'Error retrieving recommended artisans'
    });
  }
};


exports.getArtisansByCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const artisans = await artisanModel.find({
      category: { 
        $regex: category,  // Allows partial match
        $options: 'i'      // Makes it case-insensitive
      },
      accountVerification: 'Verified'
    });

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({
        message: "No artisan found in this category",
      });
    }

    res.status(200).json({
      message: "All artisans in this category",
      total: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error("Error getting artisans by category:", error.message);
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
    
    // Search in all models sequentially
    const models = [artisanModel, employerModel, adminModel];
    let user = null;

    for (let model of models) {
      user = await model.findById(id);
      if (user) break; // If user is found, stop searching
    }

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



exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword, confirmPassword } = req.body;

    // Find the user across all possible models
    let user = await artisanModel.findById(id) || 
               await employerModel.findById(id) || 
               await adminModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if the user has the correct role
    if (!['artisan', 'employer'].includes(user.role)) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }

    // Compare the current password with the stored password
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect current password'
      });
    }

    // Check if the new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New password and confirmation do not match'
      });
    }

    // Hash the new password
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.log(error.message);

    // Handle JWT error 
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      });
    }

    res.status(500).json({
      message: 'Error changing password'
    });
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