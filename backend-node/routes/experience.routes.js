const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const experienceController = require("../controllers/experience.controller");

router.post("/", verifyToken, experienceController.createExperience);
router.get("/", verifyToken, experienceController.getAllExperiences);
router.put("/", verifyToken, experienceController.updateExperience);
router.put("/reorder", experienceController.updateExperienceOrder);
router.delete("/:id", verifyToken, experienceController.deleteExperience);

module.exports = router;
