const router = require("express").Router();
const verifyToken = require("../middlewares/auth.middleware");
const contactController = require("../controllers/contact.controller");

router.post("/", verifyToken, contactController.saveContactMe);
router.get("/", verifyToken, contactController.getContactMe);

module.exports = router;
