const { initializeVerification } = require('../controllers/verification');
const { authenticate } = require('../middlewares/authentication');

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
router.post('/account/verification', authenticate, uploads.single('workCertificate'), initializeVerification);

module.exports = router;