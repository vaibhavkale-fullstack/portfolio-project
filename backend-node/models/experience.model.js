const db = require("../DB_connection/db");

/* CREATE */
exports.createExperience = async (data) => {
  const {
    user_id,
    company_name,
    role,
    employment_type,
    start_date,
    end_date,
    is_current,
    description,
    tech_stack,
    location,
    display_order
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO experience
      (user_id, company_name, role, employment_type, start_date, end_date, is_current, description, tech_stack, location, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        company_name,
        role,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        tech_stack,
        location,
        display_order
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

/* GET ALL BY USER */
exports.getExperiencesByUserId = async ({ user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM experience
       WHERE user_id = ?
       ORDER BY display_order ASC, start_date DESC`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

/* GET BY ID */
exports.getExperienceById = async ({ id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM experience WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0] || null);
      }
    );
  });
};

/* UPDATE */
exports.updateExperienceById = async (data) => {
  const {
    id,
    company_name,
    role,
    employment_type,
    start_date,
    end_date,
    is_current,
    description,
    tech_stack,
    location,
    display_order
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE experience SET
        company_name = ?,
        role = ?,
        employment_type = ?,
        start_date = ?,
        end_date = ?,
        is_current = ?,
        description = ?,
        tech_stack = ?,
        location = ?,
        display_order = ?
       WHERE id = ?`,
      [
        company_name,
        role,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        tech_stack,
        location,
        display_order,
        id
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//-------------------Display Order of experience-----------------------------

exports.updateExperienceOrder = async (experiences) => {
  if (!Array.isArray(experiences)) {
    throw new Error("Invalid data format");
  }

  const queries = experiences.map(exp => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE experience SET display_order = ? WHERE id = ?`,
        [exp.display_order, exp.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });

  // waits until ALL updates finish
  await Promise.all(queries);

  return { message: "Order updated successfully" };
};


//-----------------------------------------/* DELETE */---------------------------------------------------------

exports.deleteExperienceById = async ({ id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM experience WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
