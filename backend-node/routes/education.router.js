const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const educationController = require("../controllers/education.controller");

router.post("/", verifyToken, educationController.createEducation);
router.get("/", verifyToken, educationController.getEducations);
router.put("/", verifyToken, educationController.updateEducation);
router.put("/reorder", verifyToken, educationController.updateEducationOrder);

router.delete("/:id", verifyToken, educationController.deleteEducation);

module.exports = router;
