const { subscriptionExpire } = require('./helper/emailTemplate');
const { mail_sender } = require('./middlewares/nodemailer');
const artisanModel = require('./models/artisan');


exports.subscriptionChecker = async (req, res) => {
  try {
    const artisans = await artisanModel.find();
    artisans.map(async (e) => {
      if (e.expiresIn < Date.now() && e.subscription === 'Active') {
        const mailDetails = {
          email: e.email,
          subject: 'SUBSCRIPTION EXPIRED',
          html: subscriptionExpire()
        };

        e.subscription = 'Expired';
        e.rating = 0;
        e.isRecommended = false;
        e.isSubscribed = false;
        e.expiresIn = 0;
        await e.save();
        await mail_sender(mailDetails);
        console.log('Subscription checks completed and email sent successfully');
      } else if (e.expiresIn < Date.now() && e.subscription === 'Free') {
        const mailDetails = {
          email: e.email,
          subject: 'SUBSCRIPTION EXPIRED',
          html: subscriptionExpire()
        };

        e.subscription = 'Expired';
        e.rating = 0;
        e.isRecommended = false;
        e.isSubscribed = false;
        e.expiresIn = 0;
        await e.save();
        await mail_sender(mailDetails);
        console.log('Subscription checks completed and email sent successfully');
      }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};














// if (artisans.length === 0) {
//   return res.status(404).json({
//     message: 'No artisan found',
//   });
// }

// for (const artisan of artisans) {
//   // console.log(artisan.email);

//   if (Date.now() > artisan.expiresIn && artisan.isSubscribed === true) {
//     if (artisan.subscription === 'Active') {
//       if (artisan.isRecommended === true) {
//         const mailDetails = {
//           email: artisan.email,
//           subject: 'SUBSCRIPTION EXPIRED',
//           html: subscriptionExpire()
//         };
//         console.log('mail ', mailDetails);


//         artisan.subscription = 'Expired';
//         artisan.rating = 0;
//         artisan.isRecommended = false;
//         artisan.isSubscribed = false;
//         await artisan.save();
//         await mail_sender(mailDetails);
//         console.log('Subscription checks completed and email sent successfully');
//       } else if (artisan.isRecommended === false) {
//         const mailDetails = {
//           email: artisan.email,
//           subject: 'SUBSCRIPTION EXPIRED',
//           html: subscriptionExpire()
//         };

//         artisan.subscription = 'Expired';
//         artisan.rating = 0;
//         artisan.isSubscribed = false;
//         await artisan.save();
//         await mail_sender(mailDetails);
//         console.log('Subscription checks completed and email sent successfully');
//       }
//     }else if (artisan.subscription === 'Free') {
//       if (artisan.isRecommended === true) {
//         const mailDetails = {
//           email: artisan.email,
//           subject: 'SUBSCRIPTION EXPIRED',
//           html: subscriptionExpire()
//         };
//         console.log('mail ', mailDetails);


//         artisan.subscription = 'Expired';
//         artisan.rating = 0;
//         artisan.isRecommended = false;
//         artisan.isSubscribed = false;
//         await artisan.save();
//         await mail_sender(mailDetails);
//         console.log('Subscription checks completed and email sent successfully');
//       } else if (artisan.isRecommended === false) {
//         const mailDetails = {
//           email: artisan.email,
//           subject: 'SUBSCRIPTION EXPIRED',
//           html: subscriptionExpire()
//         };

//         artisan.subscription = 'Expired';
//         artisan.rating = 0;
//         artisan.isSubscribed = false;
//         await artisan.save();
//         await mail_sender(mailDetails);
//         console.log('Subscription checks completed and email sent successfully');
//       }
//     }
//   }
// else {
//   console.log('Subscription checks completed but no mail sent');
// }
// }
