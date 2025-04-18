const cron = require('node-cron');
const Artisan = require('../models/artisan'); 
const CronLock = require('../models/cronLock')

//  Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    //  Find all artisans whose subscription has expired but not marked as expired yet
    const expiredArtisans = await Artisan.find({
      subscriptionEndDate: { $lt: now },
      subscription: { $ne: 'Expired' }
    });

    for (const artisan of expiredArtisans) {
      artisan.subscription = 'Expired';
      artisan.isSubscribed = false;
      await artisan.save();
    }

    console.log(` Subscription check complete: ${expiredArtisans.length} accounts updated.`);
  } catch (error) {
    console.error('Error running subscription check:', error.message);
  }
});



cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const lockExpiry = new Date(now.getTime() + 10 * 60 * 1000); // lock lasts 10 mins

  try {
    // Check for active lock
    const existingLock = await CronLock.findOne({ name: 'subscriptionCheck' });

    if (existingLock && existingLock.expiresAt > now) {
      console.log('Subscription check already in progress. Skipping...');
      return;
    }

    // Acquire or update lock
    await CronLock.findOneAndUpdate(
      { name: 'subscriptionCheck' },
      { expiresAt: lockExpiry },
      { upsert: true }
    );

    // Find and update expired subscriptions
    const expiredArtisans = await Artisan.find({
      subscriptionEndDate: { $lt: now },
      subscription: { $ne: 'Expired' }
    });

    for (const artisan of expiredArtisans) {
      artisan.subscription = 'Expired';
      artisan.isSubscribed = false;
      await artisan.save();
    }

    console.log(` Subscription check done: ${expiredArtisans.length} artisan(s) updated.`);
  } catch (err) {
    console.error(' Error running subscription check:', err.message);
  } finally {
    // Release the lock
    await CronLock.findOneAndUpdate(
      { name: 'subscriptionCheck' },
      { expiresAt: new Date(now.getTime() - 1) } // mark as expired
    );
  }
});

