const express = require("express");

const {
    findAllSchemes,
    createNewScheme,
    DeleteScheme
  } = require("../controllers/scheme");
  
const { getUserById } = require("../controllers/user");  

const { getSchemeById } = require("../controllers/scheme");

const { isSignedIn, isAdmin, isTBI } = require("../controllers/auth");

const router = express.Router();

router.param("schemeId", getSchemeById);
router.param("UserId", getUserById);

//router.get("/schemes/allSchemes", isSignedIn, findAllSchemes);

router.post("/schemes/createScheme/:UserId",
    isSignedIn,
    isTBI,
    createNewScheme,
  );

  router.delete(
    "/schemes/:schemeId/:UserId",
    isSignedIn,
    isAdmin,
    DeleteScheme
  );

module.exports = router;
