const aboutMeModel = require("../models/aboutme.model");

exports.saveAboutMe = async (data) => {
  const saved = await aboutMeModel.upsertAboutMe(data);

  return {
    message: "About Me saved successfully",
    saved
  };
};

exports.getAboutMe = async ({ user_id }) => {
  return aboutMeModel.getAboutMeByUserId({ user_id });
};
