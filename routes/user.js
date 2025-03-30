const { registerUser, verifyUser, login, forgotPassword, resetPassword, getUsers, getUser, changePassword, updateProfilePic, updateAddress, deleteUser, logout, createAdmin, removeAdmin, getAdmins, getAdmin, restrictAccount, unrestrictAccount, getWorkerById,getAllWorkersInCategory, getWorkersByLocalGovt} = require('../controllers/user');
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
router.get('/create/admin/:userId', authorize, createAdmin);
router.get('/remove/admin/:userId', authorize, removeAdmin);
router.get('/restrict/account/:userId', authorize, restrictAccount);
router.get('/unrestrict/account/:userId', authorize, unrestrictAccount);
router.get('/admins', authorize, getAdmins);
router.get('/admin/:userId', authorize, getAdmin);
router.get('/users', getUsers);
router.get('/user/:userId', getUser);
router.put('/change/password', authenticate, changePassword);
router.put('/update/profile', authenticate, uploads.single('profilePic'), updateProfilePic);
router.put('/update/address', authenticate, updateAddress);
router.delete('/delete/user/:userId', authorize, deleteUser);

// workers route
router.get('/getWorker/:id', getWorkerById )
router.get('/getAllWorkers/:jobCategory', getAllWorkersInCategory)
router.get('/getWorkersByLGA/:lga', getWorkersByLocalGovt);



module.exports = router;