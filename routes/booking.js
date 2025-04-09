const { bookArtisan } = require('../controllers/booking');
const { authenticate } = require('../middlewares/authentication');

const router = require('express').Router();


/**
 * @swagger
 * /v1/book/artisan:
 *   post:
 *     summary: Book an artisan
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artisanId
 *               - location
 *               - serviceDescription
 *             properties:
 *               artisanId:
 *                 type: string
 *                 description: ID of the artisan to be booked
 *                 example: "65b7d1e8e6c1234567f91ab2"
 *               location:
 *                 type: string
 *                 description: Location where the service is needed
 *                 example: "Lagos, Nigeria"
 *               serviceDescription:
 *                 type: string
 *                 description: Description of the service required
 *                 example: "Need plumbing services for kitchen sink"
 *     responses:
 *       201:
 *         description: Artisan booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan booked successfully
 *       404:
 *         description: Employer or Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Error booking an artisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error booking an artisan
 */
router.post('/book/artisan', authenticate, bookArtisan);

module.exports = router;