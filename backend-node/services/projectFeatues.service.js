const userModel = require("../models/user.model");


exports.createProjectFeature = async (data) => {
  const { project_id, feature, user_id } = data;
  //console.log(project_id,user_id);
  
  const isOwner = await userModel.verifyProjectOwnership({ project_id, user_id });
    //console.log({project_id,user_id});
  if (!isOwner) throw new Error("Unauthorized project access");

  const created = await userModel.createProjectFeature({
    project_id,
    feature
  });

  return {
    message: "Project feature created",
    created
  };
};


exports.getProjectFeatures = async (data) => {
  const { project_id, user_id } = data;

  const isOwner = await userModel.verifyProjectOwnership({ project_id, user_id });
  if (!isOwner) throw new Error("Unauthorized project access");

  const features = await userModel.getProjectFeaturesByProjectId({ project_id });

  return {
    message: "Project features fetched",
    features
  };
};


exports.updateProjectFeature = async (data) => {
  const { id, feature, user_id } = data;
  //console.log({id});

  const existing = await userModel.getProjectFeatureById({ id });
  //console.log(existing);
  
  if (!existing) {
    throw new Error("Feature not found");
    }

  if (existing) {
    const isOwner = await userModel.verifyProjectOwnership({
      project_id: existing.project_id,
      user_id
    });
    
    if (!isOwner) throw new Error("Unauthorized project access");
  }

  const updated = await userModel.updateProjectFeatureById({
    id,
    feature
  });

  return {
    message: "Project feature updated",
    updated
  };
};


exports.deleteProjectFeature = async (data) => {
  const { id, project_id, user_id } = data;

  const isOwner = await userModel.verifyProjectOwnership({ project_id, user_id });
  if (!isOwner) throw new Error("Unauthorized project access");

  const deleted = await userModel.deleteProjectFeatureById({
    id,
    project_id
  });

  return {
    message: "Project feature deleted",
    deleted
  };
};
