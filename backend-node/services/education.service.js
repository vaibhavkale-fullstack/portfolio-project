const educationModel = require("../models/education.model");

/* CREATE */
exports.addEducation = async (data) => {
  const created = await educationModel.createEducation(data);
  return {
    message: "Education added",
    created
  };
};



/* GET ALL */
exports.getEducations = async ({ user_id }) => {
  const list = await educationModel.getEducationsByUserId({ user_id });
  return list;
};



/* UPDATE */  
exports.updateEducation = async (data) => {
  const { id, user_id } = data;

  const existing = await educationModel.getEducationById({ id });
  if (!existing) throw new Error("Education not found");

  if (existing.user_id !== user_id)                  // For Verifying Ownership 
    throw new Error("Unauthorized access");

  const updated = await educationModel.updateEducationById(data);

  return {
    message: "Education updated",
    updated
  };
};

exports.updateEducationOrder = async(data)=>{

 return await educationModel.updateEducationOrder(data);

}



/* DELETE */
exports.deleteEducation = async ({ id, user_id }) => {
  const existing = await educationModel.getEducationById({ id });
  if (!existing) throw new Error("Education not found");

  if (existing.user_id !== user_id)
    throw new Error("Unauthorized access");

  const deleted = await educationModel.deleteEducationById({ id });

  return {
    message: "Education deleted",
    deleted
  };
};
