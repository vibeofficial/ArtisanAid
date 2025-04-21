const bookingModel = require('../models/booking');
const employerModel = require('../models/employer');
const artisanModel = require('../models/artisan');
const { verifyMail, acceptJobOffer, rejectJobOffer } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');


exports.bookArtisan = async (req, res) => {
  try {
    const { id } = req.user;
    const { artisanId } = req.params;
    const { location, serviceTitle, serviceDescription, phoneNumber } = req.body;

    const employer = await employerModel.findById(id);

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found'
      })
    };

    const artisan = await artisanModel.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const booking = new bookingModel({
      artisanId: artisan._id,
      employerId: employer._id,
      location,
      serviceTitle,
      serviceDescription,
      phoneNumber
    });

    c5

    const mailDetails = {
      email: artisan.email,
      subject: 'JOB BOOKING',
      html
    };

    await mail_sender(mailDetails);
    await booking.save();

    res.status(201).json({
      message: 'Artisan booked successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ status: 'Pending' }).populate('employerId');

    res.status(200).json({
      message: 'All Pending bookings',
      data: bookings
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.getConfirmedBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ status: 'Confirmed' }).populate('employerId');

    res.status(200).json({
      message: 'All Pending bookings',
      data: bookings
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.getRejectedBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ status: 'Rejected' }).populate('employerId');

    res.status(200).json({
      message: 'All Pending bookings',
      data: bookings
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.acceptJob = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookingId } = req.params;

    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Job booking not found'
      })
    };

    const employer = await employerModel.findById(booking.employerId);

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found'
      })
    };

    const mailDetails = {
      email: employer.email,
      subject: 'JOB ACCEPT',
      html: acceptJobOffer(artisan.fullname)
    };

    await mail_sender(mailDetails);
    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({
      message: 'Job accepted successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};


exports.rejectJob = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookingId } = req.params;

    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Artisan not found'
      })
    };

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Job booking not found'
      })
    };

    const employer = await employerModel.findById(booking.employerId);

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found'
      })
    };

    const mailDetails = {
      email: employer.email,
      subject: 'JOB REJECTION',
      html: rejectJobOffer(artisan.fullname)
    };

    await mail_sender(mailDetails);
    booking.status = 'Rejected';
    await booking.save();

    res.status(200).json({
      message: 'Job rejected successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    })
  }
};