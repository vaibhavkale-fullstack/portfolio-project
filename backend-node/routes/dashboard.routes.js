const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const verifyToken = require("../middlewares/auth.middleware");

router.get('/profile-strength',verifyToken, dashboardController.getProfileStrength);

router.get('/profile-views', verifyToken, dashboardController.getProfileViews);

//get profile visitors username
router.get('/portfolio/:username', dashboardController.getPublicProfile);

router.get('/recruiter-messages', verifyToken, dashboardController.getRecruiterMessagesStats);

router.put('/:id/read', verifyToken, dashboardController.markSingleMessageRead);

module.exports = router;