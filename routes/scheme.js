const express = require("express");

const {
    findAllSchemes,
    createNewScheme,
  } = require("../controllers/scheme");
  
const { getUserById } = require("../controllers/user");  

const { isSignedIn, isAuthenticated, isAdmin, isTBI } = require("../controllers/auth");

router.get("/schemes/allSchemes", isSignedIn, findAllSchemes);

router.post("/schemes/createScheme/:UserId",
    isSignedIn,
    isAuthenticated,
    isTBI,
    createNewScheme
  );

const router = express.Router();


module.exports = router;
