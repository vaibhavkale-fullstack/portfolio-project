const contactService = require("../services/contact.service");

exports.saveContactMe = async (req, res, next) => {
  try {
    const {
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio
    } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    const result = await contactService.saveContactMe({
      user_id: req.user.id,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getContactMe = async (req, res, next) => {
  try {
    const result = await contactService.getContactMe({
      user_id: req.user.id
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
