const { bookArtisan, acceptJob, rejectJob } = require('../controllers/booking');
const { authenticate } = require('../middlewares/authentication');
const {rejectJobBooking, bookAnnArtisan} = require('../middlewares/bookingValidator')

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
router.post('/book/artisan/:artisanId',bookAnnArtisan, authenticate, bookArtisan);


/**
 * @swagger
 * /v1/accept/job/{bookingId}:
 *   get:
 *     summary: Artisan accepts a job booking
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking to accept
 *     responses:
 *       200:
 *         description: Job accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job accepted successfully
 *       404:
 *         description: Artisan or Job booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job booking not found
 *       500:
 *         description: Error accepting job offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error accepting job offer
 */
router.get('/accept/job/:bookingId', authenticate, acceptJob);


/**
 * @swagger
 * /v1/reject/job/{bookingId}:
 *   post:
 *     summary: Artisan reject a job booking
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job booking to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Unavailable at the moment"
 *     responses:
 *       200:
 *         description: Job rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job rejected successfully
 *       404:
 *         description: Artisan or booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Error rejecting job offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error rejecting job offer
 */
router.get('/reject/job/:bookingId',rejectJobBooking, authenticate, rejectJob);


module.exports = router;