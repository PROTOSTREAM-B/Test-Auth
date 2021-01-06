const express = require("express");
const {
  findAllHackathons,
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

router.param("HackYear", getHackYear);
router.param("hackathon", getHackathonById);
router.param("UserId", getUserById);

//hackathon route---> static page have 2 buttons for see hackathon project list by year and,
// create new hackathon project having by user have userID

router.get("/hackathon/allHackathons", findAllHackathons);
router.post(
  "/hackathon/createProject/:UserId",
  // isSignedIn,
  // isAuthenticated,
  createNewHackathon
);
router.delete("/hackathon/:hackathon", DeleteHackathon);

module.exports = router;
