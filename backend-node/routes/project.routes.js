const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.post("/", verifyToken, upload.array("images", 5) , projectController.addProject); // max 5 files
router.get("/", verifyToken, projectController.getProject); //Projects
router.delete("/project-image/:id", verifyToken, projectController.deleteProjectImage);

router.get("/:id", verifyToken,projectController.getProjectById); //Projectform
router.put("/", verifyToken,  upload.array("images", 5), projectController.editProject);
router.delete("/:id", verifyToken, projectController.deleteProject);


module.exports = router;

