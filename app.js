require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const projectRoute = require("./routes/projectRoute");
const hackRoute = require("./routes/hackathon");

const port = 8000;
const app = express();

app.use(express.json([]));
app.use(bodyParser.urlencoded({ extended: true }));

//! Routes..
app.use(authRoute);
app.use(projectRoute);
app.use(hackRoute);
app.use(userRoute);

//! DataBase..
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

//! Initial Routes...
app.get("/", function (req, res) {
  res.json({
    SIGNUP: "localhost:4000/api/register",
    SIGNIN: "localhost:4000/api/login",
    SIGNOUT: "localhost:4000/api/logout",
    BODY: {
      SIGNUP: "username,email,password",
      SIGNIN: "email,password",
    },
  });
});

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
