const { resendVerifyLinkValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation, registerArtisanValidation } = require('../middlewares/validator');
const { registerArtisan, verifyAccount, forgotPassword, resetPassword, changePassword, updateProfilePic, resendVerifyLink, updateProfile, resendForgotLink } = require('../controllers/artisan');
const { authenticate } = require('../middlewares/authentication');

const router = require('express').Router();
const uploads = require('../middlewares/multer');


/**
 * @swagger
 * /v1/register/artisan:
 *   post:
 *     tags:
 *       - Artisan
 *     summary: Register a new artisan
 *     description: This endpoint registers a new artisan and sends a verification email.
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
 *               - businessName
 *               - category
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@sample.com
 *               phoneNumber:
 *                 type: string
 *                 example: 08012345678
 *               password:
 *                 type: string
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 example: Password123!
 *               businessName:
 *                 type: string
 *                 example: Doe Ventures
 *               category:
 *                 type: string
 *                 example: Electrician
 *     responses:
 *       201:
 *         description: Artisan registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account Registered Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 661f5cbe5c1670b9b3d44444
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@sample.com
 *                     phoneNumber:
 *                       type: string
 *                       example: 08012345678
 *                     businessName:
 *                       type: string
 *                       example: Doe Ventures
 *                     category:
 *                       type: string
 *                       example: Plumbing
 *                     profilePic:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: some-public-id
 *                         image_url:
 *                           type: string
 *                           example: https://cloudinary.com/profile.jpg
 *                     coverPhoto:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: some-cover-id
 *                         image_url:
 *                           type: string
 *                           example: https://cloudinary.com/cover.jpg
 *       400:
 *         description: Validation or conflict error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with this phone number already exist as an artisan
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error registering artisan
 */
router.post('/register/artisan', registerArtisanValidation, uploads.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), registerArtisan);


/**
 * @swagger
 * /v1/verify/account/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Confirms the authenticity of a user's email address by validating the provided token.
 *     tags:
 *       - General
 *     security:
 *       - Bearer: []
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
 * /v1/resend/verify:
 *   post:
 *     summary: Resend account verification email
 *     description: Resends the account verification link to the provided email address if the user exists.
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@sample.com
 *                 description: The email address of the user.
 *     responses:
 *       '201':
 *         description: Verification link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Link has been sent to email address
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Server error while sending verification email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error sending mail
 */
router.post('/resend/verify', resendVerifyLinkValidation, resendVerifyLink);


/**
 * @swagger
 * /v1/forgot/password:
 *   post:
 *     summary: Request a password reset
 *     description: Allows users to request a password reset link by providing their email address.
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

router.post('/forgot/password', forgotPasswordValidation, forgotPassword);


/**
 * @swagger
 * /v1/resend/reset:
 *   post:
 *     summary: Resend account verification email
 *     description: Resends the account verification link to the provided email address if the user exists.
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@sample.com
 *                 description: The email address of the user.
 *     responses:
 *       '201':
 *         description: Verification link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Link has been sent to email address
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Server error while sending verification email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error sending mail
 */
router.post('/resend/reset', resendVerifyLinkValidation, resendForgotLink);


/**
 * @swagger
 * /v1/reset/password/{token}:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a valid reset token. The new password must match the confirmation password.
 *     tags:
 *       - General
 *     security:
 *       - Bearer: []
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
router.post('/reset/password/:token', resetPasswordValidation, resetPassword);


/**
 * @swagger
 * /v1/change/password:
 *   post:
 *     summary: Change user password
 *     description: Allows a user to change their password by providing the current password, new password, and confirming the new password.
 *     tags:
 *       - General
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
router.post('/change/password', changePasswordValidation, authenticate, changePassword);




/**
 * @swagger
 * /v1/update/profilepic:
 *   put:
 *     summary: Update user profile and profile picture
 *     description: Allows a user to update their profile details, including uploading a new profile picture.
 *     tags:
 *       - General
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
router.put('/update/profilepic', authenticate, uploads.single('profilePic'), updateProfilePic);


/**
 * @swagger
 * /v1/update/profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows an authenticated Artisan or Employer to update their profile (bio, social link, and LGA).
 *     tags:
 *       - General
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lga:
 *                 type: string
 *                 example: "Ikeja"
 *               bio:
 *                 type: string
 *                 example: "Experienced artisan specializing in home renovation and electrical work."
 *               socialMediaLink:
 *                 type: string
 *                 example: "https://linkedin.com/in/artisanpro"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "605c72ef2f1b2c0015b2b5d1"
 *                     bio:
 *                       type: string
 *                     socialMediaLink:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         lga:
 *                           type: string
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, please login to continue
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Error updating profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating profile
 */
router.put('/update/profile', authenticate, updateProfile);


module.exports = router;