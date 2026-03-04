const db = require("../DB_connection/db");

/* CREATE or UPDATE (UPSERT) */
exports.upsertAboutMe = async (data) => {
  const {
    user_id,
    title,
    summary,
    years_of_experience,
    current_role
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `
      INSERT INTO about_me
      (user_id, title, summary, years_of_experience, current_role)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        summary = VALUES(summary),
        years_of_experience = VALUES(years_of_experience),
        current_role = VALUES(current_role)
      `,
      [user_id, title, summary, years_of_experience, current_role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


/* GET */
exports.getAboutMeByUserId = async ({ user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM about_me WHERE user_id = ?`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};
