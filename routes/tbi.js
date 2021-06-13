const express = require("express");
const {
  createNewHackathon,
  deleteAHackathon,
  removeScheme,
  updateScheme,
  editFinalYearFile,
  updateFinalYearFile,
  updateNDA,
  removeInternship,
  nonApprovedStartups,
  internshipList,
} = require("../controllers/tbi");
const { getUserById } = require("../controllers/user");

const router = express.Router();

// Params..
router.param("userId", getUserById);

// Hackathons...
router.post("/hackathon/tbi/createHackathon/:userId", createNewHackathon);
router.delete("/hackathon/delete/:userId", deleteAHackathon);

//Schemes...
