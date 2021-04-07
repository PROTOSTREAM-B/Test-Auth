const express = require("express");
const {
  otplogin,
  otpverify,
} = require("../controllers/otp");


const { getUserById } = require("../controllers/user");
const { isSignedIn } = require("../controllers/auth");
// const { getStartupById } = require("../controllers/startup");

const router = express.Router();


router.param("UserId", getUserById);
// router.param("startupId", getStartupById);




router.post("/otplogin/:UserId", isSignedIn, otplogin);

router.post("/otpverify/:UserId", isSignedIn, otpverify);


module.exports = router;





