const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const projectFeaturesController = require("../controllers/projectFeatures.controller");

router.post("/:projectFeatureId", verifyToken, projectFeaturesController.createProjectFeature);
router.get("/:projectFeatureId", verifyToken, projectFeaturesController.getProjectFeatures);
router.put("/:updateid", verifyToken, projectFeaturesController.updateProjectFeature);
router.delete("/:deleteid", verifyToken, projectFeaturesController.deleteProjectFeature);

module.exports = router;
