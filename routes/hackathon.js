const express = require("express");


const {
  findAllHackathons,
  createNewHackathon,
} = require("../controllers/hackathon");


const { getUserById } = require("../controllers/user");
const { getHackYear } = require("../controllers/hackathon");
const hackathon = require("../models/hackathon");


const router = express.Router();

router.param("HackYear", getHackYear);
router.param("UserId", getUserById);


//hackathon route---> static page have 2 buttons for see hackathon project list by year and,
// create new hackathon project having by user have userID

router.get("hackathon/allHackathons/:HackYear",findAllHackathons);
router.post("hackathon/createProject/:UserId",createNewHackathon);

module.exports = router;