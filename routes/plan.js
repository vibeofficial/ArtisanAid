const { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } = require('../controllers/plan');
const { authorize, authenticate } = require('../middlewares/authentication');
const { createPlanValidator, updatePlanValidator } = require('../middlewares/planValidator')

const router = require('express').Router();


// router.post('/create/plan', createPlanValidator,authorize, createPlan);

/**
 * @swagger
 * /v1/create/plan:
 *   post:
 *     summary: Create a new subscription plan
 *     tags:
 *       - Plans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planName
 *               - amount
 *               - description
 *             properties:
 *               planName:
 *                 type: string
 *                 example: Premium
 *               amount:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: Full access to platform features
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     planName:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     description:
 *                       type: string
 *       400:
 *         description: Plan has been created already
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan has been created already
 *       500:
 *         description: Error creating plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating plan
 */
router.post('/create/plan', createPlanValidator,authorize, createPlan);




/**
 * @swagger
 * /v1/all/plan:
 *   get:
 *     summary: Retrieve all Plans
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all Plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Plans
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65b9f8f5f1b2a000176f3b22
 *                       planName:
 *                         type: string
 *                         example: Premium
 *                       amount:
 *                         type: number
 *                         example: 5000
 *                       description:
 *                         type: string
 *                         example: Premium plan with top-tier benefits
 *                       duration:
 *                         type: string
 *                         example: 3 Months
 *       404:
 *         description: No plan created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No plan created
 *       500:
 *         description: Error getting all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting all plans
 */
router.get('/all/plan', authenticate, getAllPlans);


/**
 * @swagger
 * /v1/plan/{planId}:
 *   get:
 *     summary: Get a specific subscription plan
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription plan
 *     responses:
 *       200:
 *         description: Subscription plan fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription plan
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     planName:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     duration:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found
 *       500:
 *         description: Error getting plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting plan
 */
router.get('/plan/:planId', authenticate, getPlan);



/**
 * @swagger
 * /v1/update/plan/{planId}:
 *   put:
 *     summary: Update a subscription plan
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planName
 *               - amount
 *               - description
 *               - duration
 *             properties:
 *               planName:
 *                 type: string
 *                 example: Premium
 *               amount:
 *                 type: number
 *                 example: 10000
 *               description:
 *                 type: string
 *                 example: Access to premium features
 *               duration:
 *                 type: string
 *                 example: 1 Month
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found
 *       500:
 *         description: Error updating plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating plan
 */

router.put('/update/plan/:planId',updatePlanValidator, authorize, updatePlan);


/**
 * @swagger
 * /v1/delete/plan/{planId}:
 *   delete:
 *     summary: Delete a subscription plan
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plan to delete
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found
 *       500:
 *         description: Error deleting plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting plan
 */
router.delete('/delete/plan/:planId', authorize, deletePlan);

module.exports = router;