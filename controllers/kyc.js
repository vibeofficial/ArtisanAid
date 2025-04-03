const kycModel = require('../models/kyc');
const userModel = require('../models/user');
const axios = require('axios');
const verifyMeSecretKey = process.env.VERIFYME_SECRET_KEY;


exports.initializeKyc = async (req, res) => {
  try {
    const {nin} = req.body;
    const existingNIN = await kycModel.findOne({nin: nin});

    if (existingNIN) {
      return res.status(400).json({
        message: 'NIN has already been verified with another account'
      })
    };

    const response = await axios.post(`https://vapi.verifyme.ng/v1/verifications/identities/nin/${nin}`, {
      headers: {
        Authorization: `Bearer ${verifyMeSecretKey}`
      }
    })
    console.log(response);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error initializing kyc'
    })
  }
};