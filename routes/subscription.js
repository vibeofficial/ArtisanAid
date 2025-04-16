const { initializeSubscription, verifySubscription, renewSubscription,upgradeSubscription } = require('../controllers/subscription');
const { authenticate } = require('../middlewares/authentication');

const router = require('express').Router();


/**
 * @swagger
 * /v1/initialize/payment/{planId}:
 *   get:
 *     summary: Initialize a subscription payment
 *     description: Authenticated artisans can initialize a subscription payment using a selected plan ID.
 *     tags:
 *       - Subscription
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription plan.
 *     responses:
 *       '200':
 *         description: Subscription initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'subscription initialized successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: 'ref_abc123'
 *                     checkout_url:
 *                       type: string
 *                       example: 'https://checkout.korapay.com/example'
 *       '404':
 *         description: Artisan or plan not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Plan not found'
 *       '500':
 *         description: Error initializing subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error initializing subscription'
 */
router.get('/initialize/payment/:planId', authenticate, initializeSubscription);


/**
 * @swagger
 * /v1/verify/payment:
 *   get:
 *     summary: Verify subscription payment
 *     description: Verifies the status of a subscription payment using the transaction reference.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction reference returned after initializing payment
 *     responses:
 *       200:
 *         description: Returns the result of the payment verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Transaction is successful (Renewal)'  # You can adjust this for different cases
 *                 artisan:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     businessName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     subscription:
 *                       type: string
 *                       example: 'Active'
 *                     subscriptionPlan:
 *                       type: string
 *                       example: 'Premium'
 *                     isSubscribed:
 *                       type: boolean
 *                       example: true
 *                     subscriptionEndDate:
 *                       type: string
 *                       format: date-time
 *                     rating:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: Subscription, artisan, or plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subscription not found'
 *       500:
 *         description: Error verifying subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error verifying subscription'
 */
router.get('/verify/payment', verifySubscription);


module.exports = router;