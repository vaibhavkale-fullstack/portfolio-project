const aboutMeService = require("../services/aboutme.service");

exports.saveAboutMe = async (req, res, next) => {
  try {
    const user_id = req.user.id; // from JWT
    const data = { ...req.body, user_id };

    const response = await aboutMeService.saveAboutMe(data);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

exports.getAboutMe = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const aboutMe = await aboutMeService.getAboutMe({ user_id });
    res.json(aboutMe);
  } catch (err) {
    next(err);
  }
};
