const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { jwtSecret } = require("../DB_connection/env");


//----------Signup-----------------------------


//-----------Login-------------------------------------------------

exports.login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw { status: 401, message: "User not found" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: "Invalid password" };

  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: "1h" }
  );

  const username=user.username;
  return { message: "Login success", token, username };
};


// -------------services/auth.service.js

//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const db = require("../DB_connection/db");
//const userModel = require("../models/user.model");

// helper function
function generateBaseUsername(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

async function generateUniqueUsername(name) {
  const base = generateBaseUsername(name);
  let username = base;
  let count = 0;

  while (true) {
    const existing = await userModel.findByUsername(username);

    if (!existing) return username;

    count++;
    username = `${base}-${count}`;
  }
}

exports.signup = async ({ full_name, email, password }) => {

  // 🔥 IMPORTANT: DB column is "name"
  const name = full_name;
  console.log("service",name);
  

  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔥 Generate username
  const username = await generateUniqueUsername(name);

  // 🔥 Create user
  const result = await userModel.create({
    name,
    email,
    password: hashedPassword,
    username
  });

  // 🔥 Generate token
  const token = jwt.sign(
    { id: result.insertId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    message: "User created successfully",
    token,
    username
  };
};