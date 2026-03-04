const contactMessageService = require("../services/contactmessages.service");

/* PUBLIC – portfolio contact form */
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const { userId } = req.params; // portfolio owner id

    if (!name || !email || !message) {
      throw new Error("All fields are required");
    }

    const result = await contactMessageService.sendContactMessage({
      portfolio_user_id: userId,
      sender_name: name,
      sender_email: email,
      message
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/* PRIVATE – dashboard inbox */
exports.getMyMessages = async (req, res, next) => {
  try {
    const result = await contactMessageService.getMyContactMessages({
      portfolio_user_id: req.user.id
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactMessageService.deleteContactMessage({
      id,
      portfolio_user_id: req.user.id
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
