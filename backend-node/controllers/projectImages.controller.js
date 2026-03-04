
const projectImageService = require("../services/projectImages.service");

//----------------------createProjectImage--------------------------------

exports.createProjectImage = async (req, res, next) => {
    try {

        const {image_url, is_thumbnail } = req.body;
        const {projectId} = req.params;

      if (!image_url) {
      throw new Error("image_url is required");
    }

        const isThumb = is_thumbnail === true;  // we add this because database storing null when there is no value send from postman even we assign default in sql as false
        const id = await projectImageService.createProjectImage({
            project_id: projectId,
            image_url,
            is_thumbnail: isThumb,
            user_id: req.user.id
        });

        res.status(201).json({
            message: "Project image created",
            image_id: id
        });
    } catch (err) {
        next(err);
    }
};

//-------------------GetProjectImages-------------------------------------------

exports.getProjectImages = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const images = await projectImageService.getImages({
            project_id: projectId,
            user_id: req.user.id
        });

        res.status(200).json(images);
    } catch (err) {
        next(err);
    }
};

//-----------------------updateProjectImage----------------------------------

exports.updateProjectImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { image_url, is_thumbnail } = req.body;


        const isThumb = is_thumbnail === true;
        console.log(image_url, is_thumbnail);
        
        const updated = await projectImageService.updateProjectImage({
            id,
            image_url,
            is_thumbnail: isThumb,
            user_id: req.user.id
        });

        res.status(200).json({
            message: "Project image updated",
            updated
        });
        
    } catch (err) {
        next(err);
    }
};

//-------------------------deleteProjectImage----------------------------------------

exports.deleteProjectImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await projectImageService.deleteImage({
            id,
            user_id: req.user.id
        });

        res.status(200).json({
            message: "Project image deleted",
            deleted
        });
    } catch (err) {
        next(err);
    }
};



