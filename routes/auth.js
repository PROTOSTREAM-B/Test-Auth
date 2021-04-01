const express = require("express");
const {
  register,
  login,
  logout,
  isSignedIn,
} = require("../controllers/auth");

const router = express.Router();

router.get("/register", register);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
