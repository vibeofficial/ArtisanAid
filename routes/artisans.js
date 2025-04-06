const { registerUser, verifyUser, login, forgotPassword, resetPassword, getUsers, getUser, changePassword, updateProfilePic, updateLocation, deleteUser, logout, createAdmin, removeAdmin, getAdmins, restrictAccount, unrestrictAccount, getRecommendedUsers, getUsersByCategory, getUsersByLocalGovt, updateCoverPhoto } = require('../controllers/artisans');
const { authorize, authenticate } = require('../middlewares/authorization');

const { loginEmployerValidation, employerForgotPasswordValidation,employerResetPasswordValidation, employersChangePasswordValidation } = require('../middlewares/employerValidator')

const { registerValidation, forgotPasswordValidation, resetPasswordValidation, loginValidation, getByCategoryValidation, getByLgaValidation, changePasswordValidation, updateLocationValidation } = require('../middlewares/artisanValidator');
const uploads = require('../middlewares/multer');

const router = require('express').Router();


/**
 * @swagger
 * /v1/register:
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
router.post('/register', registerValidation, registerUser);


/**
 * @swagger
 * /v1/verify/account/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Confirms the authenticity of a user's email address by validating the provided token.
 *     tags:
 *       - Artisans
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
router.get('/verify/account/:token', verifyUser);


/**
 * @swagger
 * /v1/forgot/password:
 *   post:
 *     summary: Request a password reset
 *     description: Allows users to request a password reset link by providing their email address.
 *     tags:
 *       - Artisans
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
router.post('/forgot/password', employerForgotPasswordValidation, forgotPasswordValidation, forgotPassword);


/**
 * @swagger
 * /v1/reset/password/{token}:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a valid reset token. The new password must match the confirmation password.
 *     tags:
 *       - Artisans
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
router.post('/reset/password/:token',employerResetPasswordValidation, resetPasswordValidation, resetPassword);


/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user with either email or phone number and validates the provided password.
 *     tags:
 *       - Artisans
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
router.post('/login', loginEmployerValidation, loginValidation,  login);

/**
 * @swagger
 * /v1/logout:
 *   get:
 *     summary: Log out a user
 *     tags:
 *       - Artisans
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
router.get('/logout', authenticate, logout);


/**
 * @swagger
 * /v1/create/admin/{id}:
 *   get:
 *     summary: Promote a user to Admin
 *     tags:
 *       - Artisans
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to be promoted to Admin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User has been promoted to Admin successfully
 *       '400':
 *         description: User is already an admin or is restricted
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Error creating an admin
 */
router.get('/create/admin/:id', authorize, createAdmin);


/**
 * @swagger
 * /v1/remove/admin/{id}:
 *   get:
 *     summary: Remove admin role from a user
 *     tags:
 *       - Artisans
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user whose admin role is to be removed
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User is no longer an admin
 *       '404':
 *         description: User not found or user is not an admin
 *       '500':
 *         description: Error removing an admin'
 */
router.get('/remove/admin/:id', authorize, removeAdmin);


/**
 * @swagger
 * /v1/restrict/account/{id}:
 *   get:
 *     summary: Restrict a user account
 *     description: Restrict the account of a user, preventing them from using the platform.
 *     tags:
 *       - Artisans
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
router.get('/restrict/account/:id', authorize, restrictAccount);


/**
 * @swagger
 * /v1/unrestrict/account/{id}:
 *   get:
 *     summary: Unrestrict a user account
 *     description: Removes restrictions from a user account, allowing them full access to the platform.
 *     tags:
 *       - Artisans
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
router.get('/unrestrict/account/:id', authorize, unrestrictAccount);


/**
 * @swagger
 * /v1/admins:
 *   get:
 *     summary: Get all admins
 *     description: Retrieves a list of all users with the 'Admin' role. Requires authorization.
 *     tags:
 *       - Artisans
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
router.get('/admins', authorize, getAdmins);


/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Get all approved users
 *     description: Retrieves a list of all users with the role 'User' and approved KYC status. Requires authorization.
 *     tags:
 *       - Artisans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All users
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
 *                       kycStatus:
 *                         type: string
 *       '404':
 *         description: No users found.
 *       '500':
 *         description: Error retrieving users.
 */
router.get('/users', getUsers);


/**
 * @swagger
 * /v1/recommended/users:
 *   get:
 *     summary: Get all recommended users
 *     description: Retrieves a list of all recommended users with the role 'User' and approved KYC status. Requires authorization.
 *     tags:
 *       - Artisans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all recommended users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All recommended users
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
 *                       kycStatus:
 *                         type: string
 *                       isRecommended:
 *                         type: boolean
 *       '404':
 *         description: No recommended users found.
 *       '500':
 *         description: Error retrieving recommended users.
 */
router.get('/recommended/users', getRecommendedUsers);


/**
 * @swagger
 * /v1/users/category:
 *   get:
 *     summary: Get all users in a specific category
 *     description: Retrieves all users with the role 'Artisan' in the specified category and approved KYC status.
 *     tags:
 *       - Artisans
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           example: "Plumbing"
 *         description: The category of the users.
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
 *                         type: string
 *                       kycStatus:
 *                         type: string
 *       '404':
 *         description: No users found in this category.
 *       '500':
 *         description: Error retrieving users in the category.
 */
router.get('/users/category', getByCategoryValidation, getUsersByCategory);


/**
 * @swagger
 * /v1/users/lga:
 *   get:
 *     summary: Get all users in a specific local government area (LGA)
 *     description: Retrieves all users with the role 'Artisan' in the specified LGA and approved KYC status.
 *     tags:
 *       - Artisans
 *     parameters:
 *       - in: query
 *         name: lga
 *         required: true
 *         schema:
 *           type: string
 *           example: "Ikorodu"
 *         description: The local government area (LGA) of the users.
 *     responses:
 *       '200':
 *         description: Successfully fetched all users in the specified LGA.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All users in this LGA
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
 *                       kycStatus:
 *                         type: string
 *       '404':
 *         description: No users found in this LGA.
 *       '500':
 *         description: Error retrieving users by local government.
 */
router.get('/users/lga', getByLgaValidation, getUsersByLocalGovt);


/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: Fetches a single user based on the provided user ID.
 *     tags:
 *       - Artisans
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
 * /v1/change/password:
 *   put:
 *     summary: Change user password
 *     description: Allows a user to change their password by providing the current password, new password, and confirming the new password.
 *     tags:
 *       - Artisans
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
router.put('/change/password', employersChangePasswordValidation, changePasswordValidation, authenticate, changePassword);



/**
 * @swagger
 * /v1/update/profile:
 *   put:
 *     summary: Update user profile and profile picture
 *     description: Allows a user to update their profile details, including uploading a new profile picture.
 *     tags:
 *       - Artisans
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
router.put('/update/profile', authenticate, uploads.single('profilePic'), updateProfilePic);


/**
 * @swagger
 * /v1/update/cover:
 *   put:
 *     summary: Update user cover and cover picture
 *     description: Allows a user to update their cover details, including uploading a new cover picture.
 *     tags:
 *       - Artisans
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
router.put('/update/cover', authenticate, uploads.single('coverPhoto'), updateCoverPhoto);



/**
 * @swagger
 * /v1/update/address:
 *   put:
 *     summary: Update user address
 *     description: Allows a user to update their location details, including Local Government Area (LGA) and state.
 *     tags:
 *       - Artisans
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
router.put('/update/address', updateLocationValidation, authenticate, updateLocation);


/**
 * @swagger
 * /v1/delete/user/{id}:
 *   delete:
 *     summary: Delete a user account
 *     description: Allows an admin to delete a user account from the system.
 *     tags:
 *       - Artisans
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
router.delete('/delete/user/:id', authorize, deleteUser);


module.exports = router;