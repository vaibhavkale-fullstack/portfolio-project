
const db = require("../DB_connection/db");
const fs = require("fs");
const path = require("path");

//------------Profile_created------------------

exports.createprofile = (user_id, data) => {
  const {
    full_name,
    title,
    bio,
    image,
    resume,
    resume_original_name,
    city,
    country,
    email,
    phone,
    website,
    linkedin,
    github,
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO profiles
      (user_id, full_name, title, bio, profile_image, resume, resume_original_name,
       city, country, email, phone, website, linkedin, github)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        user_id,
        full_name,
        title,
        bio,
        image,
        resume,
        resume_original_name,
        city,
        country,
        email,
        phone,
        website,
        linkedin,
        github,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};



//---------------getProfile--------------------------------

exports.getProfile = (id) => {
  //const user_id = id;
 
  
  return new Promise((resolve, reject) => {
    db.query(
      "select * from profiles where user_id = ?",
      [id],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return reject({ message: "profile not found" });
        }
        return resolve(result[0]);
      }
    );
  });
};

//--------------------editProfile--------------------------


exports.editProfile = (user_id, data, removeImage = false, removeResume = false) => {
console.log(data);

  const {
    full_name,
    title,
    bio,
    image,
    resume,
    resume_original_name,
    city,
    country,
    email,
    phone,
    website,
    linkedin,
    github,
  } = data;

  return new Promise((resolve, reject) => {

    // 🔥 Get existing image & resume
    db.query(
      `SELECT profile_image, resume FROM profiles WHERE user_id = ?`,
      [user_id],
      (err, result) => {

        if (err) return reject(err);

        const oldImage = result[0]?.profile_image;
        const oldResume = result[0]?.resume;

        let finalImage = oldImage;
        let finalResume = oldResume;

        // ===============================
        // IMAGE LOGIC
        // ===============================

        if (image) {
          if (oldImage) {
            const imagePath = path.join("upload_images", oldImage);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          finalImage = image;
        }

        if (removeImage) {
          if (oldImage) {
            const imagePath = path.join("upload_images", oldImage);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          finalImage = null;
        }

        // ===============================
        // RESUME LOGIC
        // ===============================

        if (resume) {
          if (oldResume) {
            const resumePath = path.join(__dirname, "../upload_resumes", oldResume);
;
            if (fs.existsSync(resumePath)) {
              fs.unlinkSync(resumePath);
            }
          }
          finalResume = resume;
        }

        if (removeResume) {
          if (oldResume) {
            const resumePath = path.join(__dirname, "../upload_resumes", oldResume);
;
            if (fs.existsSync(resumePath)) {
              fs.unlinkSync(resumePath);
            }
          }
          finalResume = null;
        }

        // ===============================
        // UPDATE DATABASE
        // ===============================

        db.query(
          `UPDATE profiles SET
            full_name=?,
            title=?,
            bio=?,
            profile_image=?,
            resume=?,
            resume_original_name=?,
            city=?,
            country=?,
            email=?,
            phone=?,
            website=?,
            linkedin=?,
            github=?
           WHERE user_id=?`,
          [
            full_name,
            title,
            bio,
            finalImage,
            finalResume,
            resume_original_name,
            city,
            country,
            email,
            phone,
            website,
            linkedin,
            github,
            user_id,
          ],
          (err, updateResult) => {
            if (err) return reject(err);
            resolve(updateResult);
          }
        );
      }
    );
  });
};



//---------Delete Profile-------------------------------

exports.DeleteProfile = (deleteId) => {
  const { id, user_id } = deleteId;

  return new Promise((resolve, reject) => {
    db.query(
      "Delete from profiles where id=? and user_id=?",
      [id, user_id],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};

//-----------------find userId if exist-------

exports.findByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM profiles WHERE user_id = ?",
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
