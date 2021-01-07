const express = require("express");
const {
  findAllHackathons,
  getHackathonOfUser,
  createNewHackathon,
} = require("../controllers/hackathon");

const { getUserById } = require("../controllers/user");
const {
  getHackYear,
  getHackathonById,
  DeleteHackathon,
} = require("../controllers/hackathon");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const router = express.Router();

// router.param("HackYear", getHackYear);
router.param("hackathonId", getHackathonById);
router.param("UserId", getUserById);

//hackathon route---> static page have 2 buttons for see hackathon project list by year and,
// create new hackathon project having by user have userID

router.get("/hackathon/allHackathons", isSignedIn, findAllHackathons);
router.get(
  "/hackathon/:UserId",
  isSignedIn,
  isAuthenticated,
  getHackathonOfUser
);
router.post(
  "/hackathon/createHackathon/:UserId",
  isSignedIn,
  isAuthenticated,
  createNewHackathon
);
router.delete(
  "/hackathon/:hackathonId/:UserId",
  isSignedIn,
  isAuthenticated,
  DeleteHackathon
);

module.exports = router;
