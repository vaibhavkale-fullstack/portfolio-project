const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const contactMessagesController = require("../controllers/contactmessages.controller");

/* PUBLIC – portfolio page */
router.post("/:userId", contactMessagesController.sendMessage);

/* PRIVATE – dashboard */
router.get("/", verifyToken, contactMessagesController.getMyMessages);
router.delete("/:id", verifyToken, contactMessagesController.deleteMessage);

module.exports = router;
