const express = require("express");

const {
  findallSchemes,
  createNewScheme,
  DeleteScheme,
} = require("../controllers/scheme");

const { getUserById } = require("../controllers/user");

const { getSchemeById } = require("../controllers/scheme");

const { isSignedIn, isAdmin, isTBI } = require("../controllers/auth");

const router = express.Router();

router.param("schemeId", getSchemeById);
router.param("UserId", getUserById);

// this route showing error-----

router.get("/schemes/allSchemes", isSignedIn, findallSchemes);


router.post(
  "/schemes/createScheme/:UserId",
  isSignedIn,
  isAdmin,
  createNewScheme
  );
  
  router.delete("/schemes/:schemeId/:UserId", isSignedIn, isAdmin, DeleteScheme);
  
  module.exports = router;
  
  