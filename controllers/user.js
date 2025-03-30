const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { verifyMail, reset } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');
const jwtSecret = process.env.SECRET;

exports.registerUser = async (req, res) => {
    try {
        console.log("Full Name Debug:", `"${req.body.fullName}"`);


        
        const { fullName, email, confirmEmail, username, phoneNumber, gender, age, password, confirmPassword, jobCategory, lga, state } = req.body;
        if (!fullName) {
            return res.status(400).json({ message: "Fullname is required" });
        }
        const file = req.file;
        const name = fullName.split(' ');
        const nameFormat = name.map((e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()).join(' ');



        if (password !== confirmPassword) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({
                 message: 'Password does not match'
                 });
        }

       
        if (age < 18) {
            return res.status(400).json({
                 message: 'Age must be above 18' 
                });
        }

       
        if (email !== confirmEmail) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ 
                message: 'Email does not match'
             });
        }

        const emailExists = await userModel.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({
                 message: `${email.toLowerCase()} has already been used`
                 });
        }

        const usernameExists = await userModel.findOne({ username: username.toLowerCase() });
        if (usernameExists) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({
                 message: 'Username already exists'
                 });
        }

        // Check if phone number is already in use
        const phoneExists = await userModel.findOne({ phoneNumber });
        if (phoneExists) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ 
                message: 'Phone number has already been used'
             });
        }

      
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

       
        let profilePicResult = null;
        if (file) {
            profilePicResult = await cloudinary.uploader.upload(file.path);
            fs.unlinkSync(file.path);
        }
        const allowedAdminEmail = "artisanaid.team@gmail.com"; 

        let user;
        
        if (email.toLowerCase() === allowedAdminEmail) {  
            user = new userModel({
                fullName: nameFormat,
                email,
                username,
                phoneNumber,
                gender,
                age: `${age} years`,
                password: hashedPassword,
                profilePic: profilePicResult
                    ? { public_id: profilePicResult.public_id, image_url: profilePicResult.secure_url }
                    : {},
                role: 'Admin', // Assign "Admin" role
                subscription: 'Unlimited',
            });
        } else {
            // Regular user registration (Worker)
            if (!jobCategory) {
                return res.status(400).json({ 
                    message: 'Job category is required' 
                });
            }
            if (!lga || !state) {
                return res.status(400).json({ 
                    message: 'LGA and State are required'
                 });
            }

            user = new userModel({
                fullName: nameFormat,
                email,
                username,
                phoneNumber,
                gender,
                age: `${age} years`,
                password: hashedPassword,
                profilePic: profilePicResult
                    ? { public_id: profilePicResult.public_id, image_url: profilePicResult.secure_url }
                    : {},
                role: 'User',
                jobCategory, // Store worker category
                address: { lga, state }, // Store address
                subscription: 'Demo',
                expires: Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * 3), 
            });
        }

        
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '5mins' });
        const link = `${req.protocol}://${req.get('host')}/v1/verify/user/${token}`;
        const firstName = nameFormat.split(' ')[0];
        const html = verifyMail(link, firstName);

       
        const mailDetails = {
            email: user.email,
            subject: 'ACCOUNT VERIFICATION',
            html,
            id: user._id,
            public_id: user.profilePic.public_id,
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
                    }

                    const newToken = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '5mins' });
                    const link = `${req.protocol}://${req.get('host')}/v1/verify/user/${newToken}`;
                    const firstName = user.fullname.split(' ')[0];
                    const html = verifyMail(link, firstName);

                    const mailDetails = {
                        email: user.email,
                        subject: 'RESEND: ACCOUNT VERIFICATION',
                        html
                    };

                    await mail_sender(mailDetails);

                    res.status(200).json({
                        message: 'Session has expired, link has been sent to your email address'
                    })
                }
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
                message: 'Session has expired, link has been sent to your email address'
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
        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            })
        };

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '5mins' });
        const link = `${req.protocol}://${req.get('host')}/v1/reset/password/${token}`;
        const firstName = user.fullname.split(' ')[0];
        const html = reset(link, firstName);

        const mailDetails = {
            email: user.email,
            subject: 'RESET PASSWORD',
            html
        };

        await mail_sender(mailDetails);

        res.status(200).json({
            message: 'Reset link has been sent to email address'
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

        const { userId } = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            })
        };

        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);
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
        const { username, email, phoneNumber, password } = req.body;
        let user;

        if (username) {
            user = await userModel.findOne({ username: username.toLowerCase() });

            if (!user) {
                return res.status(404).json({
                    message: 'No account found'
                })
            }
        } else if (email) {
            user = await userModel.findOne({ email: email.toLowerCase() });

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
            return res.status(400).json({
                message: 'Your account is not verified'
            })
        };

        if (user.isRestricted === true) {
            return res.status(400).json({
                message: 'Your account is restricted, contact: jueffizzy@gmail.com for complaints'
            })
        };

        user.isLoggedIn = true;
        const token = jwt.sign({ userId: user._id, isLoggedIn: user.isLoggedIn }, jwtSecret, { expiresIn: '1day' });
        const  {password: hashedPassword, ...data} = user._doc;
        await user.save();

        res.status(200).json({
            message: 'Login successfully',
            data: data,
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
                message: 'Account not found'
            })
        };

        if (user.role === 'Admin') {
            return res.status(400).json({
                message: 'User is already an admin'
            })
        };

        user.role = 'Admin';
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

        if (user.role === 'User') {
            return res.status(404).json({
                message: 'User is not an admin'
            })
        };

        user.role = 'User';
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
        const user = await userModel.findOne({ _id: userId });

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


exports.getAdmin = async (req, res) => {
    try {
        const { userId } = req.params
        const users = await userModel.findOne({ _id: userId } && { role: 'Admin' });

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
        const users = await userModel.find({ role: 'User' });

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

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session expired, please login to continue'
            })
        };

        res.status(500).json({
            message: 'Error getting all users'
        })
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
            message: 'User',
            data: user
        })
    } catch (error) {
        console.log(error.message);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session expired, please login to continue'
            })
        };

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
        const { address } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            })
        };

        const userAddress = address.split(' ');

        const data = {
            number: userAddress[0],
            name: userAddress[1],
            lga: userAddress[2],
            state: userAddress[3]
        };

        user.address = data;
        await user.save();

        res.status(200).json({
            message: 'Address updated successfully',
            data: updatedAddress
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


// Controller function to get a single worker by category
exports.getWorkerByCategory = async (req, res) => {
    try {
        // Extract category from the request body
        const { category } = req.body;

        // Check if category is provided
        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        // Find a single worker in the given category
        const worker = await userModel.findOne({ category });

        // If no worker is found, return a 404 response
        if (!worker) {
            return res.status(404).json({
                message: "No worker found in this category"
            });
        }

        // If a worker is found, return success response
        res.status(200).json({
            message: "Worker found",
            data: worker
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching worker by category:", error.message);

        // Send a server error response
        res.status(500).json({
            message: "Error fetching worker by category"
        });
    }
};


  exports.getAllWorkersInCategory = async (req, res) => {
    try {
      // Extract category from the request body
      const { category } = req.body;
  
      // Ensure category is provided
      if (!category) {
        return res.status(400).json({
          message: "Category is required",
        });
      }
  
      // Query to fetch all workers in the specified category
      const workers = await userModel.find({ category });
  
      // If no workers are found, return a 404 response
      if (workers.length === 0) {
        return res.status(404).json({
          message: "No workers found in this category",
        });
      }
  
      // Send the response with workers data
      res.status(200).json({
        message: "Workers retrieved successfully",
        data: workers,
      });
    } catch (error) {
      console.error(error.message); // Log the error for debugging
      res.status(500).json({
        message: "Error fetching workers in category",
      });
    }
  };
  
  exports.getWorkersByLocalGovt = async (req, res) => {
    try {
      // Extract LGA and verification filter from request body
      const { lga, isVerified } = req.body;
  
      // Ensure LGA is provided
      if (!lga) {
        return res.status(400).json({
          message: "Local Government (LGA) is required",
        });
      }
  
      // Create a query object to search for workers by LGA
      const query = { "address.lga": lga };
  
      // If isVerified is provided, filter by verification status
      if (isVerified !== undefined) {
        query.isVerified = isVerified === "true";
      }
  
      // Find all workers matching the query (no pagination)
      const workers = await userModel.find(query);
  
      // If no workers are found, return a 404 response
      if (workers.length === 0) {
        return res.status(404).json({
          message: "No workers found in this local government",
        });
      }
  
      // Send the response with workers data
      res.status(200).json({
        message: "Workers retrieved successfully",
        data: workers,
      });
    } catch (error) {
      console.error(error.message); // Log the error for debugging
      res.status(500).json({
        message: "Error fetching workers by local government",
      });
    }
  };
  

