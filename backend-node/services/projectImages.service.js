const userModel = require("../models/user.model");

//-------------Create Project image---------------------------

exports.createProjectImage = async (imageData) => {
  const { project_id, image_url, is_thumbnail, user_id } = imageData;

  const isOwner = await userModel.verifyProjectOwnership({ project_id, user_id });
  if (!isOwner) throw new Error("Unauthorized project access");

  if (is_thumbnail) {
    await userModel.removeThumbnailByProjectId({ project_id });
  }

  const created = await userModel.createProjectImage({
    project_id,
    image_url,
    is_thumbnail
  });

  return {
    message: "Project image created",
    created
  };
};

//--------------------Get Project Images---------------------------

exports.getImages = async (data) => {
  const { project_id, user_id } = data;

  const isOwner = await userModel.verifyProjectOwnership({ project_id, user_id });
  if (!isOwner) throw new Error("Unauthorized project access");

  const images = await userModel.getProjectImagesByProjectId({ project_id });

  return {
    message: "Project images fetched",
    images
  };
};

//--------------Update Project Images-------------------------

exports.updateProjectImage = async (updateData) => {
  const { id, image_url, is_thumbnail, user_id } = updateData;
  
  const image = await userModel.getProjectImageById?.({id});
  //console.log(image);
  if (!image) throw new Error("Image not found");

  const isOwner = await userModel.verifyProjectOwnership({
    project_id: image.project_id,
    user_id
  });
  if (!isOwner) throw new Error("Unauthorized project access");

  if (is_thumbnail) {
    await userModel.removeThumbnailByProjectId({
      project_id: image.project_id
    });
  }

  return await userModel.updateProjectImageById({
    id,
    image_url,
    is_thumbnail
  });

};

//---------------Delete Project Images------------------------- 

exports.deleteImage = async (idsForDelete) => {
  const { id, user_id } = idsForDelete;

  const image = await userModel.getProjectImageById( {id} );
  //console.log(image);
  
  if (!image) throw new Error("Image not found");

  const isOwner = await userModel.verifyProjectOwnership({
    project_id: image.project_id,
    user_id
  });
  
  if (!isOwner) throw new Error("Unauthorized project access");

  return await userModel.deleteProjectImageById({
    id,
    project_id: image.project_id
  });

 
};


