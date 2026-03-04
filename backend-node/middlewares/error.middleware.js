// module.exports = (err, req, res, next) => {
 
//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error"
//   });
// };

module.exports = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    source: err.source || "unknown",
    stack: err.stack?.slice()
  });
};

// module.exports = (err, req, res, next) => {
//   const stackLines = err.stack?.split("\n");

//   // second line contains real source
//   const origin = stackLines && stackLines[1]
//     ? stackLines[1].trim()
//     : "Unknown source";

//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     origin,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined
//   });
// };

