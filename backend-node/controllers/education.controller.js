const educationService = require("../services/education.service");

/* CREATE */
exports.createEducation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id
    };

    const result = await educationService.addEducation(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};


/* GET ALL Education */
exports.getEducations = async (req, res, next) => {
  try {
    const educations = await educationService.getEducations({
      user_id: req.user.id
    });

    res.status(200).json(educations);
  } catch (err) {
    next(err);
  }
};


/* UPDATE */
exports.updateEducation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id
    };

    const result = await educationService.updateEducation(data);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//-----------Update Education Order----------------------------

exports.updateEducationOrder = async(req, res, next)=>{
  try {

   const result= await educationService.updateEducationOrder(req.body);
   console.log(req.body);
   
       res.json(result);
  } catch (err) {
    console.error("REORDER ERROR:", err); 
    res.status(500).json({ error: err });
  }
};
    


//------------------/* DELETE */---------------------------

exports.deleteEducation = async (req, res, next) => {
  try {
    const result = await educationService.deleteEducation({
      id: req.params.id,
      user_id: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
