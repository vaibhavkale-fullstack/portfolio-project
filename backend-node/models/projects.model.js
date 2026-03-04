const db = require("../DB_connection/db");
const fs = require("fs");
const path = require("path");

//-----------Add project---------------------------

exports.createProject = async (project) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO projects 
      (user_id, title, short_description, description, tech_stack, github_url, live_url, project_type, status, is_public) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.user_id,
        project.title,
        project.short_description,
        project.description,
        project.tech_stack,
        project.github_url,
        project.live_url,
        project.project_type,
        project.status,
        project.is_public,
      ],
      (err, result) => {
        if (err) return reject(err);

        const projectId = result.insertId;

        // ---------- INSERT FEATURES ----------
        const insertFeatures = () => {
          return new Promise((res, rej) => {
            if (project.features && project.features.length > 0) {
              const featureValues = project.features.map((feature) => [
                projectId,
                feature,
              ]);

              db.query(
                "INSERT INTO project_features (project_id, feature) VALUES ?",
                [featureValues],
                (err2) => {
                  if (err2) return rej(err2);
                  res();
                }
              );
            } else {
              res();
            }
          });
        };

      // ---------- INSERT IMAGES ----------
const insertImages = () => {
  return new Promise((res, rej) => {

    if (project.images && project.images.length > 0) {

      const imageValues = project.images.map((imageName, index) => [
        projectId,
        imageName,
        index === 0 // first image = thumbnail
      ]);

      db.query(
        `INSERT INTO project_images 
        (project_id, image_url, is_thumbnail) 
        VALUES ?`,
        [imageValues],
        (err3) => {
          if (err3) return rej(err3);
          res();
        }
      );

    } else {
      res();
    }
  });
};

        // Execute both
        Promise.all([insertFeatures(), insertImages()])
          .then(() => resolve(result))
          .catch((error) => reject(error));
      }
    );
  });
};


//---------Get Project-----------------------------------

exports.getProjectByUserId = async (data) => {
  const { user_id } = data;

  return new Promise((resolve, reject) => {
    db.query(
    `SELECT p.*, pi.image_url
       FROM projects p
       LEFT JOIN project_images pi 
         ON p.id = pi.project_id 
         AND pi.is_thumbnail = 1
       WHERE p.user_id = ?`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

//----------Get projects by id and user_id-----------------------

exports.getProjectById = async (data) => {
  const { id, user_id } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 
    p.*,
    pi.id AS image_id,
    pi.image_url,
    pi.is_thumbnail,
    pf.id AS feature_id,
    pf.feature
FROM projects p
LEFT JOIN project_images pi 
    ON p.id = pi.project_id
LEFT JOIN project_features pf 
    ON p.id = pf.project_id
WHERE p.id = ? AND p.user_id = ?`,

      [id, user_id],
      (err, rows) => {
        if (err) return reject(err);

        if (!rows.length) return resolve(null);
       // console.log("Rows", rows);

        // 1. Create a base project object from the first row
        const project = { ...rows[0] };

        // 2. Use a Map to store unique features by their feature_id
        const featuresMap = new Map();
        // 3. Use a Map to store unique images by their image_id
        const imagesMap = new Map();

        rows.forEach((row) => {
          // Collect unique features
          if (row.feature_id && !featuresMap.has(row.feature_id)) {
            featuresMap.set(row.feature_id, {
              id: row.feature_id,
              feature: row.feature,
            });
          }
          // Collect unique images
          if (row.image_id && !imagesMap.has(row.image_id)) {
            imagesMap.set(row.image_id, {
              id: row.image_id,
              url: row.image_url,
              is_thumbnail: row.is_thumbnail,
            });
          }
        });

        project.features = Array.from(featuresMap.values());
        project.images = Array.from(imagesMap.values());

        // remove joined columns
        delete project.feature;
        delete project.feature_id;
        delete project.image_id;
        delete project.image_url;
        delete project.is_thumbnail;
        //console.log("Project",project);
        resolve(project);
      },
    );
  });
};

//---------------Edit Project-------------------------------

exports.updateProject = async (data) => {
  const {
    id,
    user_id,
    title,
    short_description,
    description,
    tech_stack,
    github_url,
    live_url,
    project_type,
    features,
    status,
    is_public,
    images,
    deletedImages
  } = data;
//console.log(data);

  try {

    // START TRANSACTION
    await new Promise((resolve, reject) => {
      db.beginTransaction(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    // ==============================
    // 1️⃣ UPDATE MAIN PROJECT
    // ==============================
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE projects 
         SET title=?, short_description=?, description=?, 
             tech_stack=?, github_url=?, live_url=?, 
             project_type=?, status=?, is_public=?
         WHERE id=? AND user_id=?`,
        [
          title,
          short_description,
          description,
          tech_stack,
          github_url,
          live_url,
          project_type,
          status,
          is_public,
          id,
          user_id,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    // ==============================
    //  DELETE OLD FEATURES
    // ==============================
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM project_features WHERE project_id=?",
        [id],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // ==============================
    //  INSERT NEW FEATURES
    // ==============================
    if (features && features.length > 0) {
      const featureValues = features.map((f) => [id, f]);

      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO project_features (project_id, feature) VALUES ?",
          [featureValues],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    // ==============================
    //  DELETE REMOVED IMAGES
    // ==============================
   if (deletedImages && deletedImages.length > 0) {

  // 1️⃣ Get image file names before deleting
  const imagesToDelete = await new Promise((resolve, reject) => {
    db.query(
      "SELECT id, image_url FROM project_images WHERE id IN (?) AND project_id=?",
      [deletedImages, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });

  // 2️⃣ Delete from database
  await new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM project_images WHERE id IN (?) AND project_id=?",
      [deletedImages, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });

  // 3️⃣ Delete physical files from folder
  for (const img of imagesToDelete) {

    const filePath = path.join(
      __dirname,
      "..",
      "upload_images",
      img.image_url
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}


    // ==============================
    //  INSERT NEW IMAGES
    // ==============================
    if (images && images.length > 0) {

      // Count existing images AFTER delete
      const existingImagesCount = await new Promise((resolve, reject) => {
        db.query(
          "SELECT COUNT(*) as count FROM project_images WHERE project_id=?",
          [id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result[0].count);
          }
        );
      });

      const imageValues = images.map((imageName, index) => [
        id,
        imageName,
        existingImagesCount === 0 && index === 0 // First image becomes thumbnail if no image exists
      ]);

      await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO project_images 
           (project_id, image_url, is_thumbnail) 
           VALUES ?`,
          [imageValues],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    // ==============================
    //  ENSURE ONE THUMBNAIL EXISTS
    // ==============================
    const thumbnailCount = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) as count FROM project_images WHERE project_id=? AND is_thumbnail=TRUE",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result[0].count);
        }
      );
    });

    if (thumbnailCount === 0) {

      const firstImage = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id FROM project_images WHERE project_id=? ORDER BY created_at ASC LIMIT 1",
          [id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });

      if (firstImage.length > 0) {
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE project_images SET is_thumbnail=TRUE WHERE id=?",
            [firstImage[0].id],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
      }
    }

    //  COMMIT TRANSACTION
    await new Promise((resolve, reject) => {
      db.commit(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    return { message: "Project updated successfully" };

  } catch (error) {

    //  ROLLBACK ON ERROR
    await new Promise((resolve) => {
      db.rollback(() => resolve());
    });

    throw error;
  }
};


//------------delete Project----------------

exports.deleteProjectById = async (deleteProject) => {
  const { id, user_id } = deleteProject;

  return new Promise((resolve, reject) => {
    db.query(
      "Delete from projects where id=? and user_id=?",
      [id, user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

//------------------Delete Project images if thumbnail delete then assign next image as thumbnail automatically------------------------------------------------------------------------------------

exports.deleteProjectImage = async (imageId) => {

  try {

    // 1️⃣ START TRANSACTION
    await new Promise((resolve, reject) => {
      db.beginTransaction(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    // 2️⃣ Get image info
    const image = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM project_images WHERE id=? FOR UPDATE",
        [imageId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        }
      );
    });

    if (!image) {
      throw new Error("Image not found");
    }

    const projectId = image.project_id;
    const wasThumbnail = image.is_thumbnail;
console.log(imageId);

    // 3️⃣ Delete image
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM project_images WHERE id=?",
        [imageId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // 4️⃣ If thumbnail deleted → assign new one
    if (wasThumbnail) {

      const remainingImages = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id FROM project_images WHERE project_id=? ORDER BY created_at ASC LIMIT 1",
          [projectId],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });

      if (remainingImages.length > 0) {

        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE project_images SET is_thumbnail=TRUE WHERE id=?",
            [remainingImages[0].id],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
      }
    }

    // 5️⃣ COMMIT
    await new Promise((resolve, reject) => {
      db.commit(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    return { message: "Image deleted successfully" };

  } catch (error) {

    // ❌ If ANYTHING fails → ROLLBACK
    await new Promise((resolve) => {
      db.rollback(() => resolve());
    });

    throw error;
  }
};


//----------------------------------------------------------------------------------------------------------------------------

exports.createProjectImage = async (createImage) => {
  const { project_id, image_url, is_thumbnail } = createImage;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO project_images (project_id, image_url, is_thumbnail)
       VALUES (?, ?, ?)`,
      [project_id, image_url, is_thumbnail],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

//---------------------verify User before Create ProjectImage-------------------------------

// exports.verifyProjectOwnership = async (data) => {
//   const { project_id, user_id } = data;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `SELECT id
//        FROM projects
//        WHERE id = ? AND user_id = ?`,
//       [project_id, user_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result.length > 0);
//       },
//     );
//   });
// };

// //---------------------removeThumbnailByProjectId------------------------------

// exports.removeThumbnailByProjectId = async (data) => {
//   const { project_id } = data;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `UPDATE project_images
//        SET is_thumbnail = FALSE
//        WHERE project_id = ?`,
//       [project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// //--------------Get Images--------------------

// exports.getProjectImagesByProjectId = async (data) => {
//   const { project_id } = data;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `SELECT id, project_id, image_url, is_thumbnail, created_at
//        FROM project_images
//        WHERE project_id = ?`,
//       [project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// //-------------------get images to check images are in databse or not-----------------------

// exports.getProjectImageById = async ({ id }) => {
//   return new Promise((resolve, reject) => {
//     db.query("Select * from project_images where id=?", [id], (err, result) => {
//       if (err) return reject(err);
//       resolve(result[0]);
//     });
//   });
// };

// //------------------to ensure one project should have only one thumbnail--------------------------------------

// exports.removeThumbnailByProjectId = async (data) => {
//   const { project_id } = data;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `UPDATE project_images
//        SET is_thumbnail = FALSE
//        WHERE project_id = ?`,
//       [project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// //-----------Update Project image----------------------------------

// exports.updateProjectImageById = async (updateImage) => {
//   const { id, image_url, is_thumbnail } = updateImage;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `UPDATE project_images
//        SET image_url = ?, is_thumbnail = ?
//        WHERE id = ?`,
//       [image_url, is_thumbnail, id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// //-------------------Delete images-----------------------------

// exports.deleteProjectImageById = async (deleteImage) => {
//   const { id, project_id } = deleteImage;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `DELETE FROM project_images
//        WHERE id = ? AND project_id = ?`,
//       [id, project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// //------------------------------------------------

// /* =========================
//    CREATE FEATURE          ----------Features Table-------------
// ========================= */
// exports.createProjectFeature = async (createFeature) => {
//   const { project_id, feature } = createFeature;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `INSERT INTO project_features (project_id, feature)
//        VALUES (?, ?)`,
//       [project_id, feature],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// /* =========================
//    GET FEATURES BY PROJECT
// ========================= */
// exports.getProjectFeaturesByProjectId = async (data) => {
//   const { project_id } = data;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `SELECT id, project_id, feature
//        FROM project_features
//        WHERE project_id = ?`,
//       [project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// /* =========================
//    UPDATE FEATURE
// ========================= */

// exports.getProjectFeatureById = async ({ id }) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       `Select * from project_features
//       where id=?`,
//       [id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result[0]);
//       },
//     );
//   });
// };

// exports.updateProjectFeatureById = async (updateFeature) => {
//   const { id, feature } = updateFeature;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `UPDATE project_features
//        SET feature = ?
//        WHERE id = ?`,
//       [feature, id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };

// /* =========================
//    DELETE FEATURE
// ========================= */
// exports.deleteProjectFeatureById = async (deleteFeature) => {
//   const { id, project_id } = deleteFeature;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `DELETE FROM project_features
//        WHERE id = ? AND project_id = ?`,
//       [id, project_id],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };
