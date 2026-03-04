const express = require("express");
const router = express.Router();
const skillsController = require("../controllers/skills.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", verifyToken, skillsController.addSkills);
router.get("/:id",verifyToken, skillsController.getSkills);
router.put("/:id",verifyToken, skillsController.editSkills);
router.delete("/:id", verifyToken, skillsController.deleteSkills);

module.exports = router;
