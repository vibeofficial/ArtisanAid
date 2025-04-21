const { bookArtisan, acceptJob, rejectJob, getPendingBookings, getConfirmedBookings, getRejectedBookings } = require('../controllers/booking');
const { authenticate } = require('../middlewares/authentication');
const { bookArtisanValidation } = require('../middlewares/validator');

const router = require('express').Router();


/**
 * @swagger
 * /v1/book/artisan:
 *   post:
 *     summary: Book an artisan
 *     tags:
 *       - Booking
 *     parameters:
 *       - artisanId
 *         in: path
 *         required: true
 *         description: Id of the artisan
 *         schema:
 *         type: string
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
 *               - phoneNumber
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
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number if the employer
 *                 example: "09085637287"
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
router.post('/book/artisan/:artisanId', bookArtisanValidation, authenticate, bookArtisan);


/**
 * @swagger
 * /v1/accept/job/{bookingId}:
 *   get:
 *     summary: Artisan accepts a job booking
 *     tags:
 *       - Booking
 *     security:
 *       - Bearer: []
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
 *       - Bearer: []
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
router.get('/reject/job/:bookingId', authenticate, rejectJob);


/**
 * @swagger
 * /v1/pending/job:
 *   get:
 *     summary: Get all pending bookings
 *     tags:
 *       - Booking
 *     security:
 *       - Bearer: []
 *     description: Retrieve a list of all bookings with a status of 'Pending'.
 *     responses:
 *       200:
 *         description: Successfully retrieved all pending bookings
 *         content:
 *           application/json:
 *             example:
 *               message: All Pending bookings
 *               data:
 *                 - _id: "661c2108f13f58cd7b2067e9"
 *                   status: "Pending"
 *                   employerId:
 *                     fullname: "John Doe"
 *       404:
 *         description: No pending bookings found
 *         content:
 *           application/json:
 *             example:
 *               message: No booking yet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.get('/pending/job', getPendingBookings);


/**
 * @swagger
 * /v1/confimed/job:
 *   get:
 *     tags:
 *       - Booking
 *     security:
 *       - Bearer: []
 *     summary: Get all confirmed bookings
 *     description: Retrieve a list of all bookings that have been confirmed.
 *     responses:
 *       200:
 *         description: A list of all confirmed bookings.
 *         content:
 *           application/json:
 *             example:
 *               message: All Pending bookings
 *               data:
 *                 - _id: 661b184a245f3a2f4c64c51b
 *                   status: Confirmed
 *                   employerId:
 *                     _id: 661b175afcd362d3f33be320
 *                     fullname: John Doe
 *                     phoneNumber: "08012345678"
 *       404:
 *         description: No booking yet
 *         content:
 *           application/json:
 *             example:
 *               message: No booking yet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: An unexpected error occurred
 */
router.get('/confimed/job', getConfirmedBookings);


/**
 * @swagger
 * /v1/rejected/job:
 *   get:
 *     tags:
 *       - Booking
 *     security:
 *       - Bearer: []
 *     summary: Get all rejected bookings
 *     description: Retrieve all job bookings that have been rejected
 *     responses:
 *       200:
 *         description: Successfully retrieved all rejected bookings
 *         content:
 *           application/json:
 *             example:
 *               message: All Pending bookings
 *               data:
 *                 - _id: 661babcde1234567890
 *                   status: Rejected
 *                   employerId:
 *                     _id: 660aa1234bcdef7890
 *                     fullname: John Doe
 *       404:
 *         description: No booking yet
 *         content:
 *           application/json:
 *             example:
 *               message: No booking yet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Error message from the server
 */
router.get('/rejected/job', getRejectedBookings);


module.exports = router;