const { registerArtisan, verifyAccount, forgotPassword, resetPassword, changePassword, updateProfilePic, updateLocation } = require('../controllers/artisan');
const uploads = require('../middlewares/multer');

const router = require('express').Router();


/**
 * @swagger
 * /v1/register/artisan:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user, ensuring email and phone number uniqueness and sending a verification email.
 *     tags:
 *       - Artisans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@sample.com"
 *               businessName:
 *                 type: string
 *                 example: "Doe Enterprises"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               category:
 *                 type: string
 *                 example: Technician
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "@strongpassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "@strongpassword123"
 *     responses:
 *       '201':
 *         description: User registered successfully.
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
 *                     fullname:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@sample.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "08012345678"
 *                     role:
 *                       type: string
 *                       example: "Artisan"
 *       '400':
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password does not match"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
router.post('/register/artisan', registerArtisan);


/**
 * @swagger
 * /v1/verify/account/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Confirms the authenticity of a user's email address by validating the provided token.
 *     tags:
 *       - General
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user's email.
 *     responses:
 *       200:
 *         description: Account verified successfully.
 *       400:
 *         description: Session has expired or account already verified.
 *       404:
 *         description: Token not found or user not found.
 *       500:
 *         description: Error verifying user account.
 */
router.get('/verify/account/:token', verifyAccount);


/**
 * @swagger
 * /v1/forgot/password:
 *   post:
 *     summary: Request a password reset
 *     description: Allows users to request a password reset link by providing their email address.
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
 *                 format: email
 *                 example: "johndoe@sample.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reset password link has been sent to email address"
 *       404:
 *         description: User not found with provided email.
 *       500:
 *         description: Error processing password reset request.
 */

router.post('/forgot/password',  forgotPassword);




/**
 * @swagger
 * /v1/reset/password/{token}:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a valid reset token. The new password must match the confirmation password.
 *     tags:
 *       - General
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The token sent to the user’s email for resetting the password.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password.
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Passwords do not match or token issues (e.g., expired).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password does not match"
 *       404:
 *         description: User account not found or token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Error processing password reset request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resetting password"
 */
router.post('/reset/password/:token',  resetPassword);


/**
 * @swagger
 * /v1/change/password:
 *   put:
 *     summary: Change user password
 *     description: Allows a user to change their password by providing the current password, new password, and confirming the new password.
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
 *               password:
 *                 type: string
 *                 example: "oldpassword123"
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 example: "newpassword456"
 *                 description: The user's new password.
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword456"
 *                 description: Confirmation of the new password.
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Password changed successfully'
 *       '400':
 *         description: Incorrect password or password mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Incorrect password'
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
 *         description: Error changing the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error changing password'
 */
router.put('/change/password', changePassword);




/**
 * @swagger
 * /v1/update/profile:
 *   put:
 *     summary: Update user profile and profile picture
 *     description: Allows a user to update their profile details, including uploading a new profile picture.
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
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture image file to upload.
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
 *         description: Error updating profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating profile'
 */
router.put('/update/profile', uploads.single('profilePic'), updateProfilePic);


/**
 * @swagger
 * /v1/update/address:
 *   put:
 *     summary: Update user address
 *     description: Allows a user to update their location details, including Local Government Area (LGA) and state.
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
 *               lga:
 *                 type: string
 *                 example: 'Ikeja'
 *                 description: The Local Government Area (LGA) of the user.
 *               state:
 *                 type: string
 *                 example: 'Lagos'
 *                 description: The state of the user.
 *     responses:
 *       '200':
 *         description: Location updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Location updated successfully'
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
 *         description: Error updating address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating address'
 */
router.put('/update/address', updateLocation);





module.exports = router;