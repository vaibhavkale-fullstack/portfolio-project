const projectService = require("../services/project.service");


//-----------Add Project----------------------

exports.addProject = async(req, res, next)=>{
    try {

    const imageFiles = req.files || [];

    const imageNames = imageFiles.map(file => file.filename);

       const projects = {...req.body, 
                user_id: req.user.id,
                image: imageNames};

       

       const project = await projectService.addProject(projects);
        res.status(200).json(project);
        
    } catch (err) {
        next(err)
    }
}

//-----------Get ALL Project by user_id--------------------------

exports.getProject = async(req, res, next)=>{
    
    try {

        const data = { user_id: req.user.id}
 console.log(data);
     const getPro = await projectService.getProject(data);
     res.status(200).json(getPro);
        
    } catch (err) {
        next(err);
    }
}

//---------------get project by id and user_id------------------ 

exports.getProjectById = async(req, res, next)=>{
   // console.log(req.params.id);
    
    try {

        const id = {id: req.params.id, user_id: req.user.id}

    const project = await projectService.getProjectById(id);
    res.status(200).json(project);
        
    } catch (err) {
        next(err);      
    }
}

//----------------Edit Project------------------

exports.editProject = async(req, res, next)=>{
    try {
         const imageFiles = req.files || [];
    const imageNames = imageFiles.map(file => file.filename);

        const data = {...req.body, 
            user_id: req.user.id,
        images: imageNames};

        const edited = await projectService.editProject(data);
        res.status(200).json(edited);
        
    } catch (err) {
        next(err);
    }
}

//--------------Delete Project Image--------------------------------

exports.deleteProjectImage = async(req, res, next)=>{
    console.log(req.params.id);
    
     try {
    const result = await projectService.deleteProjectImage(req.params.id);
    res.json(result);
  } catch (err) {
    next(err)
  }
}
//--------------Delete Project--------------------------

exports.deleteProject = async(req, res, next)=>{
    try {


        const idsForDelete = {id: req.params.id, user_id: req.user.id};

        const deleted = await projectService.deleteProject(idsForDelete);
        res.status(200).json(deleted);
        
    } catch (err) {
        next(err);
    }
}



