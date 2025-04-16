const subscriptionModel = require('../models/subscription');
const artisanModel = require('../models/artisan');
const planModel = require('../models/plan');
const generator = require('otp-generator');
const ref = generator.generate(15, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false });
const koraSecretKey = process.env.KORAPAY_SECRET_KEY
const axios = require('axios');


exports.initializeSubscription = async (req, res) => {
  try {
    const { id } = req.user;
    const { planId } = req.params;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const plan = await planModel.findById(planId);

    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found'
      })
    };

    const paymentDetails = {
      amount: plan.amount,
      currency: 'NGN',
      reference: ref,
      customer: { email: artisan.email, name: artisan.fullname }
    };

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentDetails, {
      headers: {
        Authorization: `Bearer ${koraSecretKey}`
      }
    });

    const { data } = response?.data;

    const subscription = new subscriptionModel({
      artisanId: artisan._id,
      planId: plan._id,
      artisanName: artisan.fullname,
      businessName: artisan.businessName,
      planName: plan.planName,
      amount: `#${paymentDetails.amount}`,
      duration: plan.duration,
      reference: data.reference
    });

    await subscription.save();

    res.status(200).json({
      message: 'subscription initialized successfully',
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.verifySubscription = async (req, res) => {
  try {
    const { reference } = req.query;
    const subscription = await subscriptionModel.findOne({ reference: reference });

    if (!subscription) {
      return res.status(404).json({
        message: 'subscription not found'
      })
    };

    const artisan = await artisanModel.findById(subscription.artisanId);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const plan = await planModel.findById(subscription.planId);

    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found'
      })
    };

    const month = parseInt(plan.duration.split(' ')[0]);

    const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: {
        Authorization: `Bearer ${koraSecretKey}`
      }
    });

    const { data } = response;

    if (data.status && data.data.status === 'success') {
      subscription.status = 'Successful';
      subscription.subscriptionDate = new Date().toLocaleString();
      subscription.subscriptionEndDate = Date.now() + ((30.44 * 24 * 60 * 60 * 1000) * month);
      await subscription.save();

      artisan.subscription = 'Active';
      artisan.subscriptionPlan = plan.planName;

      if (artisan.subscriptionPlan === 'PREMIUM PLAN') {
        artisan.rating = 5
      } else if (artisan.subscriptionPlan === 'BASIC PLAN') {
        artisan.rating = 3
      };

      await artisan.save();
      res.status(200).json({
        message: 'Transaction is successful'
      })
    } else {
      subscription.status = 'Failed'
      await subscription.save();

      res.status(200).json({
        message: 'Transaction failed'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    })
  }
};