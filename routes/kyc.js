const { initializeKyc } = require('../controllers/kyc');
const { authenticate } = require('../middlewares/authorization');

const router = require('express').Router();

router.post('/initialize/verification/:nin', authenticate, initializeKyc);

module.exports = router;