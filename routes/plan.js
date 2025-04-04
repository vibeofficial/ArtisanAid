const { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } = require('../controllers/plan');
const { authorize, authenticate } = require('../middlewares/authorization');

const router = require('express').Router();


/**
 * @swagger
 * /create/plan:
 *   post:
 *     summary: Create a subscription plan
 *     description: Allows an admin to create a new subscription plan.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *                 example: "Premium Plan"
 *                 description: The name of the subscription plan.
 *               amount:
 *                 type: number
 *                 example: 1000
 *                 description: The cost of the subscription plan.
 *               description:
 *                 type: string
 *                 example: "Access to premium features for artisans"
 *                 description: A brief description of the plan.
 *               duration:
 *                 type: integer
 *                 example: 3
 *                 description: The duration of the plan in months.
 *     responses:
 *       '201':
 *         description: Plan created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     planName:
 *                       type: string
 *                       example: "Premium Plan"
 *                     amount:
 *                       type: number
 *                       example: 3000
 *                     description:
 *                       type: string
 *                       example: "Access to premium features for artisans"
 *                     duration:
 *                       type: string
 *                       example: "3 Months"
 *       '400':
 *         description: Plan already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan has been created already"
 *       '500':
 *         description: Error creating plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating plan"
 */
router.post('/create/plan', authorize, createPlan);


router.get('/all/plan', authenticate, getAllPlans);


router.get('/plan/:planId', authenticate, getPlan);


router.put('/update/plan/:planId', authorize, updatePlan);


router.delete('/delete/plan/:planId', authorize, deletePlan);

module.exports = router;