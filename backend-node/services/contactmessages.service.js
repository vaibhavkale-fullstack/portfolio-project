const contactmessagesModel = require("../models/contactmessages.model");

exports.sendContactMessage = async (data) => {
  const messageId = await contactmessagesModel.createContactMessage(data);

  return {
    message: "Message sent successfully",
    message_id: messageId
  };
};

exports.getMyContactMessages = async ({ portfolio_user_id }) => {
  const messages = await contactmessagesModel.getContactMessagesByUserId({
    portfolio_user_id
  });

  return {
    messages
  };
};

exports.deleteContactMessage = async (data) => {
  const deleted = await contactmessagesModel.deleteContactMessageById(data);

  return {
    message: "Message deleted",
    deleted
  };
};
