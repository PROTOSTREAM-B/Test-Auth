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




router.post("/:UserId/otplogin", isSignedIn, otplogin);

router.post("/:UserId/otpverify", isSignedIn, otpverify);


module.exports = router;





