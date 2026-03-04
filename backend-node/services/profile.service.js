
const profileModel = require("../models/profile.model");


//------------Find user id if exist-------------------
exports.profile = async (user_id, data) => {
  const existing = await profileModel.findByUserId(user_id);

  if (existing.length > 0) {
    throw { status: 409, message: "Profile already exists. Use PUT to update." };
  }

  await profileModel.createprofile(user_id, data);
  return { message: "Profile created successfully" };
};

//----------------------------------------------------  

exports.editProfile = async (user_id, data, removeImage, removeResume) => {

  const existing = await profileModel.findByUserId(user_id);

  if (existing.length === 0) {
    throw { status: 404, message: "Profile not found. Create profile first." };
  }

  await profileModel.editProfile(user_id, data, removeImage, removeResume);

  return { message: "Profile updated successfully" };
};



//------------Get Profile--------------------------

exports.getProfile = async(id) => {

  return await profileModel.getProfile(id);

    //return ({Message: "got the profile"});
}  


//-----------Delete Profile--------------------

exports.deleteProfile = async(deleteId)=>{

    await profileModel.DeleteProfile(deleteId);
    return ({message:"Profile deleted",deleteId});
}

