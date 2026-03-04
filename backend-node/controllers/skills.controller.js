const skillsService = require("../services/skills.service");

exports.addSkills = async (req, res, next) => {
  try {
    let skills = req.body.skills || req.body;

    // If single object → convert to array
    if (!Array.isArray(skills)) {
      skills = [skills];
    }

    if (skills.length === 0) {
      return res.status(400).json({ message: "At least one skill is required" });
    }

    const user_id = req.user.id;

    await skillsService.addSkills(skills, user_id);

    res.status(201).json({
      message: "Skills added successfully",
      count: skills.length
    });
  } catch (err) {
    next(err);
  }
};

//---------------Get Skills------------------------

exports.getSkills = async(req, res, next)=>{
    try {
        const id = req.params.id;

        const result = await skillsService.getSkills(id);
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};

//------------------Edit Skills-------------------

exports.editSkills = async(req, res, next)=>{
  try {

    const data = {...req.body, id: req.params.id, user_id: req.user.id}

    const edit = await skillsService.editSkills(data);
    res.status(200).json(edit);
    
  } catch (err) {
    next(err);
  }
};




//--------delete Skills----------------

exports.deleteSkills= async(req, res, next)=>{
  try {

    const ids = {id: req.params.id, user_id: req.user.id};

    const deletedSkill= await skillsService.deleteSkills(ids);
    res.status(200).json(deletedSkill);
    
  } catch (err) {
    next(err);
    
  }
}


