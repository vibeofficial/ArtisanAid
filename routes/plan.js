const { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } = require('../controllers/plan');
const { authorize, authenticate } = require('../middlewares/authentication');
const { createPlanValidator, updatePlanValidator } = require('../middlewares/planValidator')

const router = require('express').Router();



router.post('/create/plan', createPlanValidator,authorize, createPlan);


router.get('/all/plan', authenticate, getAllPlans);


router.get('/plan/:planId', authenticate, getPlan);


router.put('/update/plan/:planId',updatePlanValidator, authorize, updatePlan);


router.delete('/delete/plan/:planId', authorize, deletePlan);

module.exports = router;