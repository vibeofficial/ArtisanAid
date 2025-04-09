const { createMessage } = require('../controllers/contact');

const router = require('express').Router();

router.post('/contact/us', createMessage);

module.exports = router;