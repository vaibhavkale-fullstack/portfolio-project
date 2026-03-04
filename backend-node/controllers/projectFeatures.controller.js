const projectFeatureService = require("../services/projectFeatues.service");

exports.createProjectFeature = async (req, res, next) => {
  try {
    const { feature } = req.body;
    const { projectFeatureId } = req.params;

    
    if (!feature) {
      throw new Error("feature is required");
    }

    const result = await projectFeatureService.createProjectFeature({
      project_id: projectFeatureId,
      feature,
      user_id: req.user.id
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};


exports.getProjectFeatures = async (req, res, next) => {
  try {
    const { projectFeatureId } = req.params;

    const result = await projectFeatureService.getProjectFeatures({
      project_id: projectFeatureId,
      user_id: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


exports.updateProjectFeature = async (req, res, next) => {
  try {
    const { updateid } = req.params;
    const { feature } = req.body;

    if (!feature) {
      throw new Error("feature is required");
    }

    const result = await projectFeatureService.updateProjectFeature({
      id: updateid,
      feature,
      user_id: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


exports.deleteProjectFeature = async (req, res, next) => {
  try {
    const { deleteid, projectFeatureId } = req.params;

    const result = await projectFeatureService.deleteProjectFeature({
      id: deleteid,
      project_id: projectFeatureId,
      user_id: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
