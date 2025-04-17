const { initializeVerification, acceptVerification, rejectVerification } = require('../controllers/verification');
const { authenticate, authorize } = require('../middlewares/authentication');
const { verificationValidation } = require('../middlewares/validator');

const router = require('express').Router();
const uploads = require('../middlewares/multer');


/**
 * @swagger
 * /v1/account/verification:
 *   post:
 *     summary: Initialize artisan verification
 *     description: Uploads work certificate and submits guarantor details for artisan verification.
 *     tags:
 *       - Verification
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               guarantorName:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Full name of the guarantor.
 *               guarantorPhoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *                 description: Phone number of the guarantor.
 *               workCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file showing proof of work.
 *     responses:
 *       201:
 *         description: Account verification initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verification initialized successfully"
 *                 data:
 *                   type: object
 *                   example:
 *                     guarantorName: John Doe
 *                     guarantorPhoneNumber: "08012345678"
 *                     artisanId: "609dcd4e8f8b9c23a45d1234"
 *                     workCertificate:
 *                       public_id: "some_public_id"
 *                       image_url: "https://cloudinary.com/workcert.jpg"
 *       400:
 *         description: Duplicate guarantor details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number has already being used to verify another account"
 *       404:
 *         description: Artisan account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artisan account not found"
 *       500:
 *         description: Error initializing verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error initializing verification"
 */
router.post('/account/verification/:id', authenticate, uploads.single('workCertificate'), verificationValidation, initializeVerification);


/**
 * @swagger
 * /accept/verification/{id}:
 *   get:
 *     summary: Approve artisan's verification request
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the verification document to approve
 *     responses:
 *       200:
 *         description: Account has been verified successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Account has been verified successfully
 *       404:
 *         description: Verification or artisan not found
 *         content:
 *           application/json:
 *             example:
 *               message: No verification initialized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/accept/verification', authorize, acceptVerification);


/**
 * @swagger
 * /v1/verification/reject/{id}:
 *   get:
 *     summary: Reject an artisan's verification request
 *     tags:
 *       - Verification
 *     description: This route allows an admin to reject an artisan's account verification. It updates their status and sends a rejection email.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the verification document
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification has been rejected and email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verification has been rejected
 *       404:
 *         description: Verification or artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No verification initialized
 *       500:
 *         description: Server error
 */

router.get('/reject/verification/:id', authorize, rejectVerification);



module.exports = router;