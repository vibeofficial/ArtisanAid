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


/**
 * @swagger
 * /v1/subscription/renew/{planId}:
 *   post:
 *     summary: Renew artisan's subscription
 *     description: Initiates the subscription renewal process for an artisan. Validates the artisan's current plan and initiates a new payment.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         description: The plan ID to renew the artisan's subscription.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token to authenticate the artisan
 *         schema:
 *           type: string
 *           example: 'Bearer <your_token_here>'
 *     responses:
 *       200:
 *         description: Subscription renewal initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subscription renewal initiated'
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: 'ref_1234567890'
 *                     checkout_url:
 *                       type: string
 *                       example: 'https://checkout.korapay.com/checkout?ref=ref_1234567890'
 *       400:
 *         description: Invalid plan for renewal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid plan for renewal'
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Artisan not found'
 *       500:
 *         description: Error renewing subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error renewing subscription'
 */
router.post('/subscription/renew/:planId', renewSubscription );


/**
 * @swagger
 * /v1/subscription/upgrade/{newPlanId}:
 *   post:
 *     summary: Upgrade artisan's subscription
 *     description: Initiates the subscription upgrade process for an artisan. Validates the artisan's current plan, checks for the new plan, and initiates a new payment.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: path
 *         name: newPlanId
 *         required: true
 *         description: The ID of the new plan to upgrade the artisan's subscription.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token to authenticate the artisan
 *         schema:
 *           type: string
 *           example: 'Bearer <your_token_here>'
 *     responses:
 *       200:
 *         description: Subscription upgrade initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subscription upgrade initiated'
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: 'ref_1234567890'
 *                     checkout_url:
 *                       type: string
 *                       example: 'https://checkout.korapay.com/checkout?ref=ref_1234567890'
 *       400:
 *         description: Already on the selected plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'You are already on this plan'
 *       404:
 *         description: Artisan or new plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Artisan not found'
 *       500:
 *         description: Error upgrading subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error upgrading subscription'
 */
router.post('/subscription/upgrade/:planId', upgradeSubscription)


module.exports = router;