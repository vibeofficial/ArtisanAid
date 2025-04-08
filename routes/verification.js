const { initializeVerification } = require('../controllers/verification');
const { authenticate } = require('../middlewares/authentication');

const router = require('express').Router();
const uploads = require('../middlewares/multerPdf');


/**
 * @swagger
 * /v1/account/verification:
 *   post:
 *     summary: Initialize artisan account verification
 *     description: Allows an authenticated artisan to initialize account verification by submitting a guarantor’s details and work certificate.
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - guarantorName
 *               - guarantorPhoneNumber
 *               - certificate
 *             properties:
 *               guarantorName:
 *                 type: string
 *                 example: "John Doe"
 *               guarantorPhoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the artisan's work certificate
 *     responses:
 *       '201':
 *         description: Account verification initialized successfully.
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     guarantorName:
 *                       type: string
 *                     guarantorPhoneNumber:
 *                       type: string
 *                     artisanId:
 *                       type: string
 *                     artisanName:
 *                       type: string
 *                     workCertificate:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                         image_url:
 *                           type: string
 *       '400':
 *         description: Guarantor name or phone number already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number has already being used to verify another account"
 *       '404':
 *         description: Artisan account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artisan account not found"
 *       '500':
 *         description: Error initializing verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error initializing verification"
 */
router.post('/account/verification', authenticate, uploads.single('workCertificate'), initializeVerification);

module.exports = router;