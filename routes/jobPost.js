const { createJobPost, getAllJobPost, updateJobPost, deleteJobPost } = require('../controllers/jobPost');
const { authenticate, checkSubscription } = require('../middlewares/authentication');

const router = require('express').Router();
const upload = require('../middlewares/multer');


/**
 * @swagger
 * /v1/upload/job:
 *   post:
 *     summary: Create a job post
 *     tags:
 *       - Job Post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description of the artisan job
 *               jobImage:
 *                 type: string
 *                 format: binary
 *                 description: Image representing the job
 *     responses:
 *       201:
 *         description: Job Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job Post created successfully
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
 *         description: Artisan account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Internal server error or JWT error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/upload/job', authenticate, upload.single('jobImage'), createJobPost);


/**
 * @swagger
 * /v1/job/post:
 *   get:
 *     summary: Get all job posts
 *     tags:
 *       - Job Post
 *     security:
 *       - Bearer: []
 *     description: Retrieve all job posts along with their respective artisan details.
 *     responses:
 *       200:
 *         description: All artisans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All artisans
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       jobImage:
 *                         type: object
 *                         properties:
 *                           public_id:
 *                             type: string
 *                           image_url:
 *                             type: string
 *                       artisanId:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *                           businessName:
 *                             type: string
 *                           profilePic:
 *                             type: string
 *                           category:
 *                             type: string
 *                           accountVerification:
 *                             type: boolean
 *                           isRecommended:
 *                             type: boolean
 *                           rating:
 *                             type: number
 *       404:
 *         description: No artisan found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No artisan found
 *       400:
 *         description: Session expired or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session expired, please login to continue
 */
router.get('/job/post', getAllJobPost);


/**
 * @swagger
 * /v1/upload/job/{jobPostId}:
 *   put:
 *     summary: Update a job post image for the authenticated artisan
 *     tags:
 *       - Job Post
 *     parameters:
 *       - name: jobPostId
 *         in: path
 *         required: true
 *         description: ID of the job post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               jobImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Job post updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job post updated successfully
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             example:
 *               message: Session expired, please login to continue
 *       404:
 *         description: Job post or artisan not found
 *         content:
 *           application/json:
 *             examples:
 *               AccountNotFound:
 *                 value:
 *                   message: Account not found
 *               JobPostNotFound:
 *                 value:
 *                   message: No job post found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.put('/upload/job/:jobPostId', authenticate, updateJobPost);


/**
 * @swagger
 * /v1/delete/job/{jobPostId}:
 *   delete:
 *     summary: Delete a job post created by the authenticated artisan
 *     tags:
 *       - Job Post
 *     parameters:
 *       - name: jobPostId
 *         in: path
 *         required: true
 *         description: ID of the job post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job post deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Job post deleted successfully
 *       400:
 *         description: Session expired or invalid token
 *         content:
 *           application/json:
 *             example:
 *               message: Session expired, please login to continue
 *       404:
 *         description: Job post or artisan not found
 *         content:
 *           application/json:
 *             examples:
 *               AccountNotFound:
 *                 value:
 *                   message: Account not found
 *               JobPostNotFound:
 *                 value:
 *                   message: No job post found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.delete('/delete/job/:jobPostId', authenticate, deleteJobPost);


module.exports = router;