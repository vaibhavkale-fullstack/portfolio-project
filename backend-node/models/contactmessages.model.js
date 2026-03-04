const db = require("../DB_connection/db");

exports.createContactMessage = async (data) => {
  const {
    portfolio_user_id,
    sender_name,
    sender_email,
    message
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `
      INSERT INTO contact_messages
      (portfolio_user_id, sender_name, sender_email, message)
      VALUES (?, ?, ?, ?)
      `,
      [portfolio_user_id, sender_name, sender_email, message],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

exports.getContactMessagesByUserId = async ({ portfolio_user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT *
      FROM contact_messages
      WHERE portfolio_user_id = ?
      ORDER BY created_at DESC
      `,
      [portfolio_user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.deleteContactMessageById = async ({ id, portfolio_user_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      DELETE FROM contact_messages
      WHERE id = ? AND portfolio_user_id = ?
      `,
      [id, portfolio_user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
