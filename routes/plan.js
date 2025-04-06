const { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } = require('../controllers/plan');
const { authorize, authenticate } = require('../middlewares/authentication');

const router = require('express').Router();



router.post('/create/plan', authorize, createPlan);


router.get('/all/plan', authenticate, getAllPlans);


router.get('/plan/:planId', authenticate, getPlan);


router.put('/update/plan/:planId', authorize, updatePlan);


router.delete('/delete/plan/:planId', authorize, deletePlan);

module.exports = router;