const experienceModel = require("../models/experience.model");

/* CREATE */
exports.addExperience = async (data) => {
  const created = await experienceModel.createExperience(data);
  return {
    message: "Experience added",
    created
  };
};


/* GET ALL */
exports.getExperiences = async ({ user_id }) => {
  
  return await experienceModel.getExperiencesByUserId({ user_id });
};

//-----------------------------------------------------------------------------------

exports.updateExperienceOrder = async(data)=>{
  return await experienceModel.updateExperienceOrder(data);
}

//--------------------* UPDATE *------------------------------------
exports.updateExperience = async (data) => {
  const { id, user_id } = data;

  const existing = await experienceModel.getExperienceById({ id });
  if (!existing) throw new Error("Experience not found");

  if (existing.user_id !== user_id)
    throw new Error("Unauthorized access");

  const updated = await experienceModel.updateExperienceById(data);

  return {
    message: "Experience updated",
    updated
  };
};



/* DELETE */
exports.deleteExperience = async ({ id, user_id }) => {
  const existing = await experienceModel.getExperienceById({ id });
  if (!existing) throw new Error("Experience not found");

  if (Number(existing.user_id) !== Number(user_id))
    throw new Error("Unauthorized access");

  const deleted = await experienceModel.deleteExperienceById({ id });

  return {
    message: "Experience deleted",
    deleted
  };
};
