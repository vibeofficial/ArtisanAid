const nodemailer = require("nodemailer");


exports.mail_sender = (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.NODEMAILER_SERVICE,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.APP_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `ARTISANS AID TEAM <${process.env.APP_USERNAME}>`, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      html: options.html, // html body
    });

    console.log("Message sent: ", options.email);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);

};


exports.mail_reciever = (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.NODEMAILER_SERVICE,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.APP_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: options.email, // sender address
      to: process.env.APP_USERNAME, // list of receivers
      subject: options.subject, // Subject line
      html: options.message, // html body
    });

    console.log("Message sent: ", process.env.APP_USERNAME);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);

};