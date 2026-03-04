const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");


router.post("/",verifyToken,upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), 
profileController.profile);

router.get("/",verifyToken, profileController.getProfile);

router.put("/update-profile", verifyToken, upload.fields([ { name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 },]),

profileController.updateProfile
);

router.delete("/:id",verifyToken, profileController.deleteProfile);

module.exports = router;
