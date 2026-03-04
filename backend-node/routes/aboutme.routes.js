const router = require("express").Router();
const verifyToken = require("../middlewares/auth.middleware");
const aboutMecontroller = require("../controllers/aboutme.controller");

router.post("/", verifyToken, aboutMecontroller.saveAboutMe);
router.get("/", verifyToken, aboutMecontroller.getAboutMe);

module.exports = router;
