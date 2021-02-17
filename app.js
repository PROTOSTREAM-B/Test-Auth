require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const projectRoute = require("./routes/projectRoute");
const hackRoute = require("./routes/hackathon");
const innotechRoute = require("./routes/innotech");
const schemeRoute = require("./routes/scheme");
const cors = require("cors");

const app = express();

app.use(express.json([]));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//! Routes..
app.use(authRoute);
app.use(projectRoute);
app.use(hackRoute);
app.use(innotechRoute);
app.use(schemeRoute);
app.use(userRoute);

//! DataBase..
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

app.listen(process.env.PORT, function () {
  console.log("Server is running on port " + process.env.PORT);
});
