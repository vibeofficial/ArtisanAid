const { registerUser, verifyUser, login, forgotPassword, resetPassword, getUsers, getUser, changePassword, updateProfilePic, updateAddress, deleteUser, logout, createAdmin, removeAdmin, getAdmins, getAdmin } = require('../controllers/user');
const { authorize, authenticate } = require('../middlewares/authorization');
const { registerValidation } = require('../middlewares/validator');
const uploads = require('../middlewares/multer');

const router = require('express').Router();

router.post('/register', uploads.single('profilePic'), registerValidation, registerUser);
router.get('/verify/user/:token', verifyUser);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password/:token', resetPassword);
router.post('/login', login);
router.get('/logout', authenticate, logout);
router.get('/create/admin', authorize, createAdmin);
router.get('/remove/admin', authorize, removeAdmin);
router.get('/admins', authorize, getAdmins);
router.get('/admin', authorize, getAdmin);
router.get('/users', getUsers);
router.get('/user', getUser);
router.put('/change/password', authenticate, changePassword);
router.put('/update/profile', authenticate, uploads.single('profilePic'), updateProfilePic);
router.put('/update/address', authenticate, updateAddress);
router.delete('/delete/user/:id', authorize, deleteUser);


module.exports = router;