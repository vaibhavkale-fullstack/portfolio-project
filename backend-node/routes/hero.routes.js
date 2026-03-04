const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const heroController = require("../controllers/hero.controller");

router.get("/hero",verifyToken, heroController.getHero);

module.exports = router;
