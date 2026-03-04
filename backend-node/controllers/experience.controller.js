const experienceService = require("../services/experience.service");

/* CREATE */
exports.createExperience = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id
    };

    const result = await experienceService.addExperience(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};


/* GET ALL */
exports.getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await experienceService.getExperiences({
      user_id: req.user.id
    });

    //console.log(user_id);
    
    res.status(200).json(experiences);
  } catch (err) {
    next(err);
  }
};

//-------------------------------Get Experience-------------------------------------------

// exports.getExperienceById = async (req, res, next) => {
//   try {
//     const experiences = await experienceService.getExperienceById({ id: req.params.id });

//     //console.log(user_id);
    
//     res.status(200).json(experiences);
//   } catch (err) {
//     next(err);
//   }
// };

//----------------------------------------------------------------------------------------------------

/* UPDATE */
exports.updateExperience = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id
    };

    const result = await experienceService.updateExperience(data);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//-------------------Display Order of experience-----------------------------

exports.updateExperienceOrder = async (req, res, next) => {
  try {
    //console.log("REORDER BODY:", req.body); 

    await experienceService.updateExperienceOrder(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("REORDER ERROR:", err); 
    res.status(500).json({ error: err });
  }
};


//----------------------/* DELETE */----------------------------------------

exports.deleteExperience = async (req, res, next) => {

  try {
    
    const result = await experienceService.deleteExperience({
      id: req.params.id,
      user_id: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
