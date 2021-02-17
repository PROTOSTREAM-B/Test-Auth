const express = require("express");
const {
  register,
  login,
  logout,
  isSignedIn,
  otpsend,
  otpverify,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);

router.post("/register/otps", otpsend);

router.post("/register/otps/otpv", otpverify);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
