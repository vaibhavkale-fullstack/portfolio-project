require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use('/upload_images', express.static('upload_images'));

app.use('/upload_resumes', express.static('upload_resumes'));
// global error handler
app.use(errorMiddleware);

module.exports = app;
 