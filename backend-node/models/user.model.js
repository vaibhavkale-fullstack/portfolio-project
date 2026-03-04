const db = require("../DB_connection/db");

//------------------Signup----------------------
exports.create = ({ name, email, password, username }) => {
  console.log("model",name);
  
  return new Promise((resolve, reject) => {
    db.query(
       `INSERT INTO portfoliouser (full_name, email, password, username)
       VALUES (?, ?, ?, ?)`,
      [name, email, password, username],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return reject({ message: "Email already Exist" });
          }
        }
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


//-------------------login----------------------------

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM portfoliouser WHERE email = ?",
      [email],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) {
          return reject({ message: "User not found" });
        }
        resolve(result[0]);
      }
    );
  });
};

exports.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};
//----------------------------------------------------------------


//-----------------------------------------------------------
//--------Skills add-----------------------------------------

exports.Create = (skills) => {
  return new Promise((resolve, reject) => {
    const values = skills.map((skill) => [
      skill.user_id,
      skill.skill_name,
      skill.skill_level,
      skill.skill_type,
    ]);

    db.query(
      `INSERT INTO skills (user_id, skill_name, skill_level, skill_type)
       VALUES ?`,
      [values],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//-------------get skills-------------------

exports.getSkillsbyUserId = async (id) => {
  return new Promise((resolve, reject) => {
    db.query("Select * from skills Where user_id=?", [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//------------------editSkills-----------------------

exports.EditSkills = async (data) => {
  const { id, user_id, skill_name, skill_level, skill_type } = data;

  return new Promise((resolve, reject) => {
    db.query(
      "Update skills set skill_name=?, skill_level=?, skill_type=? Where id=? and user_id=?",
      [skill_name, skill_level, skill_type, id, user_id],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};

//-----------delete skills----------------

exports.deleteSkills = async (ids) => {
  const { id, user_id } = ids;

  return new Promise((resolve, reject) => {
    db.query(
      "delete from skills where id=? and user_id=?",
      [id, user_id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

//---------------------------------------------------------



