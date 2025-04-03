const { mail_reciever } = require('../middlewares/nodemailer');
const contactModel = require('../models/contact');


exports.createMessage = async (req, res) => {
  try {
    const { fullname, email, message } = req.body;
    const full_name = fullname.split(' ');
    const nameFormat = full_name?.map((e) => {
      return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase()
    }).join(' ');

    const mailDetails = {
      email,
      subject: 'FEEDBACK',
      message
    };

    const contactMessage = new contactModel({
      fullname: nameFormat,
      email,
      message
    });

    await mail_reciever(mailDetails);
    await contactMessage.save();

    res.status(201).json({
      message: 'Message sent successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error creating Contact Us message'
    })
  }
};