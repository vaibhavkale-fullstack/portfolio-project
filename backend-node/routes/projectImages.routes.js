const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const projectImagesController = require("../controllers/projectImages.controller");

router.post("/:projectId", verifyToken, projectImagesController.createProjectImage);
router.get("/:projectId", verifyToken, projectImagesController.getProjectImages);
router.put("/:id", verifyToken, projectImagesController.updateProjectImage);
router.delete("/:id", verifyToken, projectImagesController.deleteProjectImage);

module.exports = router;
