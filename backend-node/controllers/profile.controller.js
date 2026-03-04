const profileService = require("../services/profile.service");


//------------------Profile Create----------------
exports.profile = async (req, res, next) => {
  try {
    const imagePath = req.files?.image ? req.files.image[0].filename : null;
    const resumeFile = req.files?.resume ? req.files.resume[0].filename : null;
    const resumeOriginalName = req.files?.resume
      ? req.files.resume[0].originalname
      : null;

      console.log(resumeOriginalName);
      
    const user_id = req.user.id;

    const profile = {
      ...req.body,
      image: imagePath,
      resume: resumeFile,
      resume_original_name: resumeOriginalName,
    };

    const result = await profileService.profile(user_id, profile);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};



//-------------------Get Profile------------------------

exports.getProfile = async(req, res, next) => {
    try {

        //const user_id = req.params.id;
        const result = await profileService.getProfile(req.user.id);
        res.status(200).json(result);
        //console.log(result);
        
    } catch (err) {
        err.source = "profile.controller.js";
        next(err);
    };
};

//----------edit Profile-----------------------------

exports.updateProfile = async (req, res) => {
  try {

    const user_id = req.user.id;

    const removeImage = req.body.removeImage === "true";
    const removeResume = req.body.removeResume === "true";
  const resumeOriginalName = req.files?.resume
      ? req.files.resume[0].originalname
      : null;

    const data = {
      ...req.body,
      image: req.files?.image ? req.files.image[0].filename : null,
      resume: req.files?.resume ? req.files.resume[0].filename : null,
      resume_original_name: resumeOriginalName
    };
console.log(resumeOriginalName);

    await profileService.editProfile(user_id, data, removeImage, removeResume);

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




//-----------delete Profile--------------


exports.deleteProfile = async(req, res, next)=>{
try {

    const deleteId = {...req.params, user_id: req.user.id};

    const result = await profileService.deleteProfile(deleteId);
    res.status(200).json(result);
    
} catch (err) {
    err.source = "profile.controller.js";
    next(err)
};
};



