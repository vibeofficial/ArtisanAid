const bookingModel = require('../models/booking');
const employerModel = require('../models/employer');
const artisanModel = require('../models/artisan');
const { verifyMail } = require('../helper/emailTemplate');
const { mail_sender } = require('../middlewares/nodemailer');


exports.bookArtisan = async (req, res) => {
  try {
    const { id } = req.user;
    const { artisanId } = req.params;
    const { location, serviceDescription } = req.body;

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
      artisanName: artisan.fullname,
      employerId: employer._id,
      employerName: employer.fullname,
      employerEmail: employer.email,
      employerPhoneNumber: employer.phoneNumber,
      location,
      serviceDescription
    });

    const html = verifyMail(link, artisan.fullname);

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
      message: 'Error booking an artisan'
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

    booking.status = 'Accepted';

    const employerHtml = verifyMail(booking.employerName);

    const employerMailDetails = {
      email: booking.employerEmail,
      subject: 'JOB ACCEPTED',
      employerHtml
    };

    await mail_sender(employerMailDetails);

    const artisanHtml = verifyMail(booking.artisanName);

    const artisanMailDetails = {
      email: artisan.email,
      subject: 'JOB ACCEPTED',
      artisanHtml
    };

    await mail_sender(artisanMailDetails);
    await booking.save();

    res.status(200).json({
      message: 'Job accepted successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error accepting job offer'
    })
  }
};


exports.rejectJob = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookingId } = req.params;
    const { reason } = req.body;

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

    booking.status = 'Rejected';

    const employerHtml = verifyMail(booking.employerName, reason);

    const employerMailDetails = {
      email: booking.employerEmail,
      subject: 'JOB REJECTED',
      employerHtml
    };

    await mail_sender(employerMailDetails);

    const artisanHtml = verifyMail(booking.artisanName);

    const artisanMailDetails = {
      email: artisan.email,
      subject: 'JOB REJECTED',
      artisanHtml
    };

    await mail_sender(artisanMailDetails);
    await booking.save();

    res.status(200).json({
      message: 'Job rejected successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error rejecting job offer'
    })
  }
};