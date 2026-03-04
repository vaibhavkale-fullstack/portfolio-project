
const projectModel = require("../models/projects.model");


//------Add Project---------------------

exports.addProject = async (projects) => {


  return projectModel.createProject(projects);
};

//--------Get ALL Project bu user_id--------------------------

exports.getProject = async(data)=>{

    const getPro = await projectModel.getProjectByUserId(data);
    return (getPro);
}

//----------------get Project by id and user_id-------------------------------

exports.getProjectById = async(id)=>{

  return await projectModel.getProjectById(id);
}

//-----------Edit Project----------------

exports.editProject = async(data)=>{

    const edited = await projectModel.updateProject(data);
    return ({message:"Edited",edited});

}

//----------Delete Project Image---------------------------

exports.deleteProjectImage = async(imageId)=>{

 const deleteImage= await projectModel.deleteProjectImage(imageId);
return ({message:"Image Deleted",deleteImage});
}

//------------Delete Project----------

exports.deleteProject = async(idsForDelete)=>{

  const deleted = await projectModel.deleteProjectById(idsForDelete);
  return({message:"Project Deleted", deleted});
}

