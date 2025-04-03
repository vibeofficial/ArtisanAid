const { registerUser, verifyUser, login, forgotPassword, resetPassword, getUsers, getUser, changePassword, updateProfilePic, updateAddress, deleteUser, logout, createAdmin, removeAdmin, getAdmins, restrictAccount, unrestrictAccount, getRecommendedUsers, getUsersByCategory, getUsersByLocalGovt } = require('../controllers/user');
const { authorize, authenticate } = require('../middlewares/authorization');
const { registerValidation } = require('../middlewares/validator');
const uploads = require('../middlewares/multer');

const router = require('express').Router();

router.post('/register', registerValidation, registerUser);
router.get('/verify/account/:token', verifyUser);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password/:token', resetPassword);
router.post('/login', login);
router.get('/logout', authenticate, logout);
router.get('/create/admin/:userId', authorize, createAdmin);
router.get('/remove/admin/:userId', authorize, removeAdmin);
router.get('/restrict/account/:userId', authorize, restrictAccount);
router.get('/unrestrict/account/:userId', authorize, unrestrictAccount);
router.get('/admins', authorize, getAdmins);
router.get('/users', getUsers);
router.get('/recommended/users', getRecommendedUsers);
router.get('/users/category', getUsersByCategory);
router.get('/users/lga', getUsersByLocalGovt);
router.get('/user/:userId', getUser);
router.put('/change/password', authenticate, changePassword);
router.put('/update/profile', authenticate, uploads.single('profilePic'), updateProfilePic);
router.put('/update/address', authenticate, updateAddress);
router.delete('/delete/user/:userId', authorize, deleteUser);

module.exports = router;