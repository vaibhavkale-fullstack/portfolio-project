const contactModel = require("../models/contact.model");

exports.saveContactMe = async (data) => {
  const saved = await contactModel.upsertContactMe(data);

  return {
    message: "Contact details saved",
    saved
  };
};

exports.getContactMe = async ({ user_id }) => {
  const contact = await contactModel.getContactMeByUserId({ user_id });

  return {
    contact
  };
};
