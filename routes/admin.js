const { getAdmins, restrictAccount, unrestrictAccount, getVerifiedArtisans, getEmployers, getUser, deleteAccount, registerAdmin, getUnVerifiedArtisans, getProcessingArtisans, getDeclinedArtisans } = require('../controllers/admin');

const router = require('express').Router();
const uploads = require('../middlewares/multerImages');


/**
 * @swagger
 * /v1/admin:
 *   post:
 *     summary: Register a new admin
 *     description: Creates a new admin account with fullname, phone number, email, and password.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - phoneNumber
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Jane Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               email:
 *                 type: string
 *                 example: "janedoe@sample.com"
 *               password:
 *                 type: string
 *                 example: "StrongP@ssw0rd"
 *               confirmPassword:
 *                 type: string
 *                 example: "StrongP@ssw0rd"
 *     responses:
 *       '201':
 *         description: Admin account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account registered successully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *       '400':
 *         description: Password mismatch or email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password does not match"
 *       '500':
 *         description: Server error while registering.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering admin"
 */
router.post('/admin', uploads.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]), registerAdmin);


/**
 * @swagger
 * /v1/admins:
 *   get:
 *     summary: Get all admins
 *     description: Retrieves a list of all users with the 'Admin' role. Requires authorization.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All admins
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No admin users found.
 *       '500':
 *         description: Error retrieving admins.
 */
router.get('/admins', getAdmins);


/**
 * @swagger
 * /v1/restrict/account/{id}:
 *   get:
 *     summary: Restrict a user account
 *     description: Restrict the account of a user, preventing them from using the platform.
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user whose account will be restricted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Account is restricted successfully.
 *       '404':
 *         description: Account not found or account is already restricted.
 *       '500':
 *         description: Internal server error while restricting account.
 */
router.get('/restrict/account/:id', restrictAccount);


/**
 * @swagger
 * /v1/unrestrict/account/{id}:
 *   get:
 *     summary: Unrestrict a user account
 *     description: Removes restrictions from a user account, allowing them full access to the platform.
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user whose account will be unrestricted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Account is no longer restricted.
 *       '404':
 *         description: Account not found or account is not restricted.
 *       '500':
 *         description: Internal server error while unrestricting account.
 */
router.get('/unrestrict/account/:id', unrestrictAccount);


/**
 * @swagger
 * /v1/verified/artisans:
 *   get:
 *     summary: Get all verified artisans
 *     description: Retrieves a list of all artisans with verified account verification status..
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all artisans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No artisan found.
 *       '500':
 *         description: Error retrieving artisans.
 */
router.get('/verified/artisans', getVerifiedArtisans);


/**
 * @swagger
 * /v1/unverified/artisans:
 *   get:
 *     summary: Get all unverified artisans
 *     description: Retrieves a list of all artisans with unverified account verification status..
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all artisans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No artisan found.
 *       '500':
 *         description: Error retrieving artisans.
 */
router.get('/verified/artisans', getUnVerifiedArtisans);


/**
 * @swagger
 * /v1/processing/artisans:
 *   get:
 *     summary: Get all pending artisans
 *     description: Retrieves a list of all artisans with pending account verification status..
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all artisans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No artisan found.
 *       '500':
 *         description: Error retrieving artisans.
 */
router.get('/processing/artisans', getProcessingArtisans);


/**
 * @swagger
 * /v1/declined/artisans:
 *   get:
 *     summary: Get all declined artisans
 *     description: Retrieves a list of all artisans with declined account verification status..
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all artisans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No artisan found.
 *       '500':
 *         description: Error retrieving artisans.
 */
router.get('/declined/artisans', getDeclinedArtisans);


/**
 * @swagger
 * /v1/employers:
 *   get:
 *     summary: Get all verified employers
 *     description: Retrieves a list of all employers that are verified
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Successfully fetched all employers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       role:
 *                         type: string
 *       '404':
 *         description: No artisan found.
 *       '500':
 *         description: Error retrieving artisans.
 */
router.get('/employers', getEmployers);


/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: Fetches a single user based on the provided user ID.
 *     tags:
 *       - General
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d2a0ef91b88b7e85b10c5c"
 *         description: The ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: Successfully fetched the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User below'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     role:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     kycStatus:
 *                       type: string
 *       '404':
 *         description: User not found with the provided ID.
 *       '500':
 *         description: Error retrieving the user.
 */
router.get('/user/:id', getUser);


/**
 * @swagger
 * /v1/delete/{id}:
 *   delete:
 *     summary: Delete a user account
 *     description: Allows an admin to delete a user account from the system.
 *     tags:
 *       - Admin
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be deleted.
 *         schema:
 *           type: string
 *           example: '60d21b4667d0d8992e610c85'
 *     responses:
 *       '200':
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Account deleted successfully'
 *       '400':
 *         description: Invalid session or session expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session expired, please login to continue'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User does not exist'
 *       '500':
 *         description: Error deleting account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting account'
 */
router.delete('/delete/:id', deleteAccount);


module.exports = router;