const reportModel = require('../models/report');
const artisanModel = require('../models/artisan');
const employerModel = require('../models/employer');
const { mail_reciever } = require('../middlewares/nodemailer');
const jwt = require('jsonwebtoken');


exports.reportArtisan = async (req, res) => {
  try {
    const { id } = req.user;
    const { artisanId } = req.params;
    const { reason } = req.body;

    const employer = await employerModel.findById(id);

    if (!employer) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const artisan = await artisanModel.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const report = new reportModel({
      artisanId: artisan._id,
      employerId: employer._id,
      reason
    });

    const mailDetails = {
      email: employer.email,
      subject: 'REPORT ARTISAN',
      html: reason
    };

    await mail_reciever(mailDetails);
    await report.save();

    res.status(201).json({
      message: 'Report sent successfully'
    })
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, login to continue'
      })
    };

    res.status(500).json({
      message: error.message
    })
  }
};


exports.getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.find().populate('artisanId').populate('employerId');

    res.status(200).json({
      message: 'All reports',
      data: reports
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};