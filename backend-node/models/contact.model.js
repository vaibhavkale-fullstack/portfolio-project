const db = require("../DB_connection/db");

exports.upsertContactMe = async (data) => {
  const {
    user_id,
    email,
    phone,
    location,
    linkedin,
    github,
    portfolio
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `
      INSERT INTO contact_me 
        (user_id, email, phone, location, linkedin, github, portfolio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        phone = VALUES(phone),
        location = VALUES(location),
        linkedin = VALUES(linkedin),
        github = VALUES(github),
        portfolio = VALUES(portfolio)
      `,
      [user_id, email, phone, location, linkedin, github, portfolio],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.getContactMeByUserId = async ({ user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM contact_me WHERE user_id = ?`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0] || null);
      }
    );
  });
};


