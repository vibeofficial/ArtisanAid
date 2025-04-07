const { initializeSubscription, verifySubscription } = require('../controllers/subscription');
const { authenticate } = require('../middlewares/authentication');

const router = require('express').Router();

router.get('/initialize/payment/:userId/:planId', authenticate, initializeSubscription);
router.get('/verify/payment', verifySubscription);

module.exports = router;