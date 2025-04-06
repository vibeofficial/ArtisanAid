const artisanModel = require('../models/artisans');
const employersModel = require('../models/employers');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.SECRET;

exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, businessName, phoneNumber, category, password, confirmPassword } = req.body;

    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
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

    let artisan;

    if (email === 'artisanaid.team@gmail.com') {
      artisan = new artisanModel({
        fullname: nameFormat,
        email,
        phoneNumber,
        password: hashedPassword,
        role: 'Admin',
        accountVerification: 'Verified',
        subscription: 'Unlimited',
        subscriptionPlan: 'Unlimited'
      });
    } else {
      artisan = new artisanModel({
        fullname: nameFormat,
        email,
        businessName,
        phoneNumber,
        category,
        password: hashedPassword,
        role: 'Artisan',
        accountVerification: 'Unverified',
        subscription: 'Demo',
        subscriptionPlan: 'Demo',
        expires: Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * 3),
      });
    };

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

exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      });
    }

    jwt.verify(token, process.env.SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { id } = jwt.decode(token);
          const artisan = await artisanModel.findById(id);

          if (!artisan) {
            return res.status(404).json({
              message: 'Artisan not found'
            })
          };


          const user = await artisanModel.findById(id) || 
                       await employersModel.findById(id);

          if (!user || !['artisan', 'employer'].includes(user.role.toLowerCase())) {
            return res.status(404).json({
              message: 'User not found'
            });
          }


          if (artisan.isVerified === true) {
            return res.status(400).json({
              message: 'Account has already been verified'
            });
          }

          const newToken = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${newToken}`;
          const html = verifyMail(link, user.fullName || user.businessName || user.nameFormat || 'User')

          const mailDetails = {
            email: artisan.email,
            subject: 'RESEND: ACCOUNT VERIFICATION',
            html
          };

          await mail_sender(mailDetails);

          return res.status(200).json({
            message: 'Session expired, a new verification link has been sent to your email address'
          });
        }
      } else {
        // Token is valid, verify the user
        const user = await artisanModel.findById(payload.id) ||
                     await employersModel.findById(payload.id);

        if (!user || !['artisan', 'employer'].includes(user.role.toLowerCase())) {
          return res.status(404).json({
            message: 'User not found'
          });
        }


        if (artisan.isVerified === true) {
          return res.status(400).json({
            message: 'Account has already been verified'
          });
        }

        artisan.isVerified = true;
        await artisan.save();

        return res.status(200).json({
          message: 'Account verified successfully'
        });
      }
    });
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session has expired'
      });
    }
    return res.status(500).json({
      message: 'Error verifying account'
    });

  }
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await artisanModel.findOne({ email: email?.toLowerCase() }) ||
                 await employersModel.findOne({ email: email?.toLowerCase() });

    if (!['artisan','employer'].includes(user.role).toLowerCase()) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }


    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/v1/reset/password/${token}`;

    const name = user.nameFormat || user.businessName || user.fullName || 'User';
    const html = reset(link, name);  // Only two args: the link and name
   const mailDetails = {
      email: artisan.email,
      subject: 'RESET YOUR PASSWORD',
      html
    };

    await mail_sender(mailDetails);

    res.status(200).json({
      message: 'Reset password link has been sent to email address'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error forgetting password'
    });
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


    const { id } = jwt.verify(token, process.env.SECRET);

  

   const user = await artisanModel.findById(id) ||
                await employersModel.findById(id);
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

    const { email,phoneNumber, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: !email ?'Email is required': 'password is required'
      });
    }

    const user = await artisanModel.findOne({ email: email.toLowerCase() }) ||
                 await employersModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    if (!['artisan', 'employer'].includes(user.role.toLowerCase())) {
      return res.status(403).json({
         message: `Login not allowed for user role: ${user.role}`
         });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
         message: 'Incorrect password'
         });
    }


    if (user.isVerified !== true) {
      const verificationToken = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5mins' });
      const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${verificationToken}`;
      const html = verifyMail(link, user.fullName || user.businessName);


      const mailDetails = {
        email: artisan.email,
        subject: 'ACCOUNT VERIFICATION',
        html
      };

      await mail_sender(mailDetails);
      console.log("Sending verification email to:", user.email);

      return res.status(401).json({
        message: 'Your account is not verified, a verification link has been sent to your email address'
      });
    }


    if (user.isRestricted === true) {
      return res.status(403).json({

        message: 'Your account is restricted, contact: artisanaid.team@gmail.com to resolve'
      });
    }

    user.isLoggedIn = true;
    const loginToken = jwt.sign(
      { id: user._id, isLoggedIn: user.isLoggedIn, role: user.role }, process.env.SECRET,{ expiresIn: '1d' }
    );
    await user.save();


    res.status(200).json({
      message: 'Login successful',
      loginToken
    });
  } catch (error) {

    console.error(error.message);
    res.status(500).json({ 
      message: 'Error logging in' 
    });

  }
};


// exports.login = async (req, res) => {
//   try {
//     const { email, phoneNumber, password } = req.body;
//     let artisan;

//     if (email) {
//       artisan = await artisanModel.findOne({ email: email?.toLowerCase() });

//       if (!artisan) {
//         return res.status(404).json({
//           message: 'No account found'
//         })
//       }
//     } else if (phoneNumber) {
//       artisan = await artisanModel.findOne({ phoneNumber: phoneNumber });

//       if (!artisan) {
//         return res.status(404).json({
//           message: 'No account found'
//         })
//       }
//     };

//     const correctPassword = await bcrypt.compare(password, artisan.password);

//     if (!correctPassword) {
//       return res.status(400).json({
//         message: 'Incorrect password'
//       })
//     };

//     if (artisan.isVerified !== true) {
//       const token = jwt.sign({ id: artisan._id }, jwtSecret, { expiresIn: '5mins' });
//       const link = `${req.protocol}://${req.get('host')}/v1/verify/account/${token}`;
//       const html = verifyMail(link, artisan.businessName);

//       const mailDetails = {
//         email: artisan.email,
//         subject: 'ACCOUNT VERIFICATION',
//         html
//       };

//       await mail_sender(mailDetails);
//       return res.status(401).json({
//         message: 'Your account is not verified, link has been sent to email address'
//       })
//     };

//     if (artisan.isRestricted === true) {
//       return res.status(400).json({
//         message: 'Your account is restricted, contact: artisanaid.team@gmail.com to resolve'
//       })
//     };

//     artisan.isLoggedIn = true;
//     const token = jwt.sign({ id: artisan._id, isLoggedIn: artisan.isLoggedIn, role: artisan.role }, jwtSecret, { expiresIn: '1day' });
//     await artisan.save();

//     res.status(200).json({
//       message: 'Login successfully',
//       token
//     })
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({
//       message: 'Error logging artisan in'
//     })
//   }
// };

exports.logout = async (req, res) => {
  try {
    const { id } = req.user;


    if (!id) {
      return res.status(400).json({
        message: 'User is not logged in'
      });
    }

    // Try to find user in both models
    user = await artisanModel.findById(id) || 
           await employersModel.findById(id);


    if (!user) {
      return res.status(404).json({

        message: 'User not found'
      });
    }

    if (!['artisan', 'employer'].includes(user.role)) {
      return res.status(403).json({
        message: 'Invalid user role'
      });
    }

    user.isLoggedIn = false;
    await user.save();


    res.status(200).json({
      message: 'Logout successfully'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({

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
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (artisan.isRestricted === true) {
      return res.status(404).json({
        message: 'This account is already restricted'
      })
    };

    artisan.isRestricted = true;
    await artisan.save();

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
    const artisan = await artisanModel.findOne({ _id: id });

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (artisan.isRestricted === false) {
      return res.status(404).json({
        message: 'This account is not restricted'
      })
    };

    artisan.isRestricted = false;
    await artisan.save();

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
    const users = await artisanModel.find({ role: 'Admin' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No artisan found'
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
    const users = await artisanModel.find({ role: 'Artisan' } && { accountVerification: 'Verified' });

    if (users.length < 1) {
      return res.status(404).json({
        message: 'No artisan found'
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


exports.getUsersByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const users = await artisanModel.find({ role: 'Artisan' } && { category: category } && { accountVerification: 'Verified' });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No artisan found in this category",
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

    const location = { lga, state }
    const users = await artisanModel.find({ role: 'Artisan' } && { location: location } && { accountVerification: 'Verified' });

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
    const { id } = req.params;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    res.status(200).json({
      message: 'Artisan below',
      data: artisan
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

    let user;

        user = await artisanModel.findById(id) ||
               await employersModel.findById(id)

    if (!['artisan', 'employer'].includes(user.role)) {

      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const correctPassword = await bcrypt.compare(password, artisan.password);

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
    artisan.password = hashedPassword;
    await artisan.save();

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
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      profilePic: artisan.profilePic
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(artisan.profilePic.public_id);
      const profilePicResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.profilePic = {
        public_id: profilePicResult.public_id,
        image_url: profilePicResult.secure_url
      };

      const updatedProfilePic = await artisanModel.findByIdAndUpdate(artisan._id, data, { new: true });

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
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      coverPhoto: artisan.coverPhoto
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(artisan.coverPhoto.public_id);
      const coverPhotoResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      data.coverPhoto = {
        public_id: coverPhotoResult.public_id,
        image_url: coverPhotoResult.secure_url
      };

      const updatedCoverPhoto = await artisanModel.findByIdAndUpdate(artisan._id, data, { new: true });

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
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const data = {
      location: artisan.location
    };

    data.location = {
      number,
      street,
      lga,
      state
    };

    const updatedLocation = await artisanModel.findByIdAndUpdate(artisan._id, data, { new: true })

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
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan does not exist'
      })
    };

    const deletedUser = await artisanModel.findByIdAndDelete(artisan._id);

    if (deletedUser) {
      await cloudinary.uploader.destroy(artisan.profilePic.public_id);
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