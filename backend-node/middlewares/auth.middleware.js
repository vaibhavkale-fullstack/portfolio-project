const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../DB_connection/env");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  //console.log("Headers:" ,req.headers);
  //console.log("authentication:" ,req.headers.authorization);
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    //console.log("this is from middleware:",req.user);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
