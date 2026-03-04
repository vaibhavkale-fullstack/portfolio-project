const authService = require("../services/auth.service");

exports.signup = async (req, res, next) => {
  try {
    //console.log(req.body);
    
    const result = await authService.signup(req.body);
    res.status(201).json(result);
    console.log("This is from authcontroller:",result);
    
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
    console.log("This is from authcontroller:",result);
  } catch (err) {
      console.log("This is from authcontroller:",err);
    next(err);
  }
};

//------------------------------

// const authService = require("../services/auth.service");

// exports.register = async (req, res, next) => {
//   try {
//     const result = await authService.registerUser(req.body);

//     res.status(201).json({
//       message: "User registered successfully",
//       username: result.username
//     });

//   } catch (err) {
//     next(err);
//   }
// };
