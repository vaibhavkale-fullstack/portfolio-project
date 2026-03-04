const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/profile", require("./profile.routes"));
router.use("/skills",require("./skills.routes"));
router.use("/project", require("./project.routes"));
router.use("/projectImage", require("./projectImages.routes"));
router.use("/projectFeatureId", require("./projectFeatures.routes"));
router.use("/education", require("./education.router"));
router.use("/experience", require("./experience.routes"));
router.use("/aboutme", require("./aboutme.routes"));
router.use("/contact", require("./contact.routes"));
router.use("/contactMessage", require("./contactmessages.routes"))
router.use("/", require("./hero.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/recruiter",require("./portfolio.routes"));

module.exports = router;



