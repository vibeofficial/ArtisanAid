const { subscriptionExpire } = require('./helper/emailTemplate');
const { mail_sender } = require('./middlewares/nodemailer');
const artisanModel = require('./models/artisan');


exports.subscriptionChecker = async (req, res) => {
  try {
    const artisans = await artisanModel.find();

    if (artisans.length === 0) {
      return res.status(404).json({
        message: 'No artisan found',
      });
    }

    for (const artisan of artisans) {
      if (Date.now() > artisan.expiresIn && ['Free', 'Active'].includes(artisan.subscription) && artisan.isSubscribed === true) {
        if (artisan.isRecommended === true) {
          for (const email of artisan.email) {
            const mailDetails = {
              email: email,
              subject: 'SUBSCRIPTION EXPIRED',
              html: subscriptionExpire()
            };

            artisan.subscription = 'Expired';
            artisan.rating = 0;
            artisan.isRecommended = false;
            artisan.isSubscribed = false;
            await artisan.save();
            await mail_sender(mailDetails);
            console.log('Subscription checks completed and email sent successfully');
          }
        } else if (artisan.isRecommended === false) {
          for (const email of artisan.email) {
            const mailDetails = {
              email: email,
              subject: 'SUBSCRIPTION EXPIRED',
              html: subscriptionExpire()
            };

            artisan.subscription = 'Expired';
            artisan.rating = 0;
            artisan.isSubscribed = false;
            await artisan.save();
            await mail_sender(mailDetails);
            console.log('Subscription checks completed and email sent successfully');
          }
        }
      } else {
        console.log('Subscription checks completed but no mail sent');
      }
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};