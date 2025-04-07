const { registerEmployer, getArtisanById,getAllArtisans, verifyEmployer } = require('../controllers/employers');
const {authorize, authenticate} = require('../middlewares/authentication')
const { employerValidation,  } = require('../middlewares/employerValidator')

const router = require('express').Router();

router.post('/registerEmployer', employerValidation, registerEmployer);
// router.get('/verify/account/:token', verifyEmployer)
router.get('/artisan/:artisanId', authenticate, getArtisanById); 
router.get('/artisans', authenticate, getAllArtisans); 


module.exports = router;