const { registerEmployer, login, logout, getRecommendedArtisans, getArtisansByCategory, getArtisansByLocalGovt, updateCoverPhoto, updateSocialLink, getArtisans } = require('../controllers/employers');

const router = require('express').Router();
const uploads = require('../middlewares/multer');


/**
 * @swagger
 * /v1/register/employer:
 *   post:
 *     summary: Register a new employer
 *     description: Creates a new employer account with full name, email, phone number, and password. Also checks for existing accounts in both employer and artisan collections.
 *     tags:
 *       - Employers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - phoneNumber
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@sample.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "08123456789"
 *               password:
 *                 type: string
 *                 example: "SecureP@ssw0rd"
 *               confirmPassword:
 *                 type: string
 *                 example: "SecureP@ssw0rd"
 *     responses:
 *       '201':
 *         description: Employer account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account Registered Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       '400':
 *         description: Duplicate email, phone number, or password mismatch.
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
 *                   example: "Error registering employer"
 */
router.post('/register/employer', registerEmployer);


/**
 * @swagger
 * /v1/artisans:
 *   get:
 *     summary: Get all approved artisans
 *     description: Retrieves a list of all artisans with approved account verification status..
 *     tags:
 *       - General
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
router.get('/artisans', getArtisans);


/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user with either email or phone number and validates the provided password.
 *     tags:
 *       - General
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "user@sample.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "08012345679"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successfully"
 *                 token:
 *                   type: string
 *                   description: The JWT token used for authenticating further requests.
 *       400:
 *         description: Incorrect password, account not verified, or account is restricted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       401:
 *         description:  Account not verified, or account is restricted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your account is not verified, link has been sent to email address"
 *       404:
 *         description: No account found with the provided email or phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No account found"
 *       500:
 *         description: Error processing login request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging user in"
 */
router.post('/login',login);


/**
 * @swagger
 * /v1/logout:
 *   get:
 *     summary: Log out a user
 *     tags:
 *       - General
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Error logging user out
 */
router.get('/logout', logout);


/**
 * @swagger
 * /v1/recommended/artisans:
 *   get:
 *     summary: Get all recommended artisans
 *     description: Retrieves a list of all recommended artisans with approved account verification status.
 *     tags:
 *       - General
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all recommended artisans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All recommended artisans
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
 *         description: No recommended artisans found.
 *       '500':
 *         description: Error retrieving recommended artisans.
 */
router.get('/recommended/artisans', getRecommendedArtisans);


/**
 * @swagger
 * /v1/artisans/category:
 *   post:
 *     summary: Get all users in a specific category
 *     description: Retrieves all users artisan the specified category and approved account verificatoon status.
 *     tags:
 *       - General
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Plumbing"
 *     responses:
 *       '200':
 *         description: Successfully fetched all users in the specified category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All users in this category
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
 *                       category:
 *       '404':
 *         description: No users found in this category.
 *       '500':
 *         description: Error retrieving users in the category.
 */
router.post('/artisans/category', getArtisansByCategory);


/**
 * @swagger
 * /v1/artisans/lga:
 *   get:
 *     summary: Get all users in a specific local government area (LGA)
 *     description: Retrieves all artisans in the specified LGA and approved account verification status.
 *     tags:
 *       - General
 *     parameters:
 *       - in: query
 *         name: lga
 *         required: true
 *         schema:
 *           type: string
 *           example: "Ikorodu"
 *         description: The local government area (LGA) of the artisans.
 *     responses:
 *       '200':
 *         description: Successfully fetched all artisans in the specified LGA.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans in this LGA
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
 *                       lga:
 *                         type: string
 *       '404':
 *         description: No artisans found in this LGA.
 *       '500':
 *         description: Error retrieving artisans by local government.
 */
router.get('/artisans/lga', getArtisansByLocalGovt);


/**
 * @swagger
 * /v1/update/cover:
 *   put:
 *     summary: Update user cover and cover picture
 *     description: Allows a user to update their cover details, including uploading a new cover picture.
 *     tags:
 *       - General
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverPhoto:
 *                 type: string
 *                 format: binary
 *                 description: The cover picture image file to upload.
 *     responses:
 *       '200':
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Profile updated successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: 'profile_pic_12345'
 *                         image_url:
 *                           type: string
 *                           example: 'https://res.cloudinary.com/sample-cloud/image/upload/v1616161616/profile_pic_12345.jpg'
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
 *         description: Account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Account not found'
 *       '500':
 *         description: Error updating cover.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating cover'
 */
router.put('/update/cover', uploads.single('coverPhoto'), updateCoverPhoto);


/**
 * @swagger
 * /v1/update/social:
 *   put:
 *     summary: Update artisan social media link
 *     description: Allows an authenticated artisan to update their social media link.
 *     tags:
 *       - General
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               socialLink:
 *                 type: string
 *                 example: "https://linkedin.com/in/artisan-profile"
 *                 description: The social media link of the artisan.
 *     responses:
 *       '200':
 *         description: Social link updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Social link updated successfully"
 *       '404':
 *         description: Account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       '500':
 *         description: Error updating social link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating social link"
 */
router.put('/update/social', updateSocialLink);


module.exports = router;