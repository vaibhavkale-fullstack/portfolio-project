const userModel = require("../models/user.model");


exports.addSkills = async (skills, user_id) => {

  const skillsData = skills.map(skill=>({
    ...skill,
    user_id
  }))
    
  return userModel.Create(skillsData);   // we don't need to wirte await because userModel is returning promise
};

//---------get Skills-----------------

exports.getSkills = async(id)=>{

    const skills = await userModel.getSkillsbyUserId(id);

    return ({message:"Got skills",skills});
}

//----------edit Skils----------------

exports.editSkills = async(data)=>{

  const editedSkills = await userModel.EditSkills(data);

  return ({message:"Skills edited",editedSkills});
}

//-----delete Skills---------------

exports.deleteSkills = async(ids)=>{

  const deleted = await userModel.deleteSkills(ids);

  return ({message:"Skills deleted", deleted});
}

