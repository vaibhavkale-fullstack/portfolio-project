const db = require("../DB_connection/db");


exports.getProfileByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM profiles WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
              //console.log(result);

      }
      
    );
  });
};

exports.getEducationCount = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT *  FROM education WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

exports.getExperienceCount = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM experience WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

exports.getProjectCount = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM projects WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

//------------------Profile Views-------------------------------------------

exports.getTotalProfileViews = (userId) => {
    //console.log("model views",userId);
    
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT COUNT(*) as total FROM profile_views WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0].total);
        //console.log(result);
        
      }
    );
  });
};

//-----------------------------------------------------------------------------

exports.getWeeklyProfileViews = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT COUNT(*) as total FROM profile_views 
       WHERE user_id = ? 
       AND viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0].total);
      }
    );
  });
};

//---------------------------------------------------------

exports.findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]); // return single user
      }
    );
  });
};

//----------------------------------------------------------------

exports.findProfileByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM profile WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]); // return single profile
      }
    );
  });
};

//----------------------------------------------------------------

exports.checkRecentView = (userId, ip) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM profile_views
       WHERE user_id = ?
       AND viewer_ip = ?
       AND viewed_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
       LIMIT 1`,
      [userId, ip],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]); // undefined if no recent view
      }
    );
  });
};

//-----------------------Insert profile visitors---------------------------------------------

exports.insertProfileView = (userId, ip, userAgent) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO profile_views (user_id, viewer_ip, user_agent)
       VALUES (?, ?, ?)`,
      [userId, ip, userAgent],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//----------------------------------------------------------------

exports.getTotalMessages = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT *  FROM recruiter_messages WHERE portfolio_user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//----------------------------------------------------------------

exports.getUnreadMessages = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT *  FROM recruiter_messages WHERE portfolio_user_id = ? AND is_read = 0",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
//-------------------------------------------------

exports.markMessageAsRead = (messageId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE recruiter_messages 
       SET is_read = 1 
       WHERE id = ?`,
      [messageId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};