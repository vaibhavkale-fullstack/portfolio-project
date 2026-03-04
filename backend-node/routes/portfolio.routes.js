const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/portfolio.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/",verifyToken, recruiterController.receiveMessages);
router.get("/:username", recruiterController.getPortfolioByUsername);


module.exports = router;