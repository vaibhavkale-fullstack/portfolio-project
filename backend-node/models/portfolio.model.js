const db = require("../DB_connection/db");

exports.recruiterMessages = (data) => {
    console.log("model",data);
    
  const { 
   name,
   email,
   message,
    user_id
  } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO recruiter_messages
      ( sender_name, sender_email, message,portfolio_user_id)
       VALUES (?,?,?,?)`,
      [
         name, email, message,user_id
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//----------------------------------

exports.getPortfolioByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, name, username, email
       FROM portfoliouser
       WHERE username = ?`,
      [username],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

