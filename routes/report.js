const { reportArtisan, getAllReports } = require('../controllers/report');
const { authenticate, authorize } = require('../middlewares/authentication');

const router = require('express').Router();


/**
 * @swagger
 * /v1/report/artisan:
 *   post:
 *     summary: Report an artisan
 *     tags:
 *       - Report Artisan
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: ArtisanId
 *         in: path
 *         description: The ID of the user whose account will be restricted.
 *         required: true
 *         schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artisanId:
 *                 type: string
 *                 description: ID of the artisan being reported
 *               reason:
 *                 type: string
 *                 description: Reason for reporting the artisan
 *             required:
 *               - artisanId
 *               - reason
 *     responses:
 *       201:
 *         description: Artisan reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan reported successfully
 *       400:
 *         description: Invalid input or session expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, please login to continue
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan not found
 */
router.post('/report/artisan/:artisanId',authenticate, reportArtisan );


/**
 * @swagger
 * /v1/all/reports:
 *   get:
 *     summary: Get all reports
 *     tags:
 *       - Report Artisan
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all reports made by employers against artisans.
 *     responses:
 *       200:
 *         description: All reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All reports
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       reason:
 *                         type: string
 *                       artisanId:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *                           email:
 *                             type: string
 *                           isReported:
 *                             type: boolean
 *                           verificationStatus:
 *                             type: string
 *                       employerId:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *       404:
 *         description: No report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No report
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/all/reports', authorize, getAllReports);


module.exports = router;