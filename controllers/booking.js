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
      location,
      serviceDescription
    });

    const html = verifyMail(link, artisan.fullname);

    const mailDetails = {
      email: artisan.email,
      subject: 'ACCOUNT VERIFICATION',
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