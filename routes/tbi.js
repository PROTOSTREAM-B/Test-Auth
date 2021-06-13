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
