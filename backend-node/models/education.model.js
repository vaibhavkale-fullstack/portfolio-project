const db = require("../DB_connection/db");


//---------------------------------------Education Table---------------------------------
/* CREATE */
exports.createEducation = async (data) => {
  const {
    user_id,
    degree,
    field_of_study,
    institution,
    start_year,
    end_year,
    grade,
    status,
    description,
    display_order,
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO education
      (user_id, degree, field_of_study, institution, start_year, end_year, grade, status, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        degree,
        field_of_study,
        institution,
        start_year,
        end_year,
        grade,
        status,
        description,
        display_order,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


/* GET ALL BY USER */
exports.getEducationsByUserId = async ({ user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM education
       WHERE user_id = ?
       ORDER BY display_order ASC, start_year DESC`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


/* GET BY ID */
exports.getEducationById = async ({ id }) => {
  return new Promise((resolve, reject) => {

    db.query(
      `SELECT * FROM education WHERE id = ?`, 
      [id], 
      (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};


/* UPDATE */
exports.updateEducationById = async (data) => {
  const {
    id,
    degree,
    field_of_study,
    institution,
    start_year,
    end_year,
    grade,
    status,
    description,
    display_order,
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE education SET
        degree = ?,
        field_of_study = ?,
        institution = ?,
        start_year = ?,
        end_year = ?,
        grade = ?,
        status = ?,
        description = ?,
        display_order = ?
       WHERE id = ?`,
      [
        degree,
        field_of_study,
        institution,
        start_year,
        end_year,
        grade,
        status,
        description,
        display_order,
        id,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//--------------update Education Order--------------------


exports.updateEducationOrder = async(education)=>{
  if(!Array.isArray(education)){
    throw new Error ("Invalid data format");
  }
  

const queries = education.map(edu=>{

  return new Promise((res, rej) => {
        db.query(
          `UPDATE education SET display_order = ? WHERE id = ?`,
          [edu.display_order, edu.id],
          (err, result) => {
            if (err) return rej(err);
            res(result);
          }
        );
      });
    });

   await Promise.all(queries);
  
  
     return { message: "Order updated successfully" };


  };

  


//---------------------------/* DELETE */-----------------------------

exports.deleteEducationById = async ({ id }) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM education WHERE id = ?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};