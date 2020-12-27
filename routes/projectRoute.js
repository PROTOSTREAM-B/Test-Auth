const express = require("express");
const { isAuthenticated } = require("../controllers/auth");
const {
  findAllProjects,
  createProject,
  pushProjectInUser,
} = require("../controllers/projectController");
const { getUserById } = require("../controllers/user");

const router = express.Router();

router.get("/projects", findAllProjects);
//params..
router.param("UserId", getUserById);

router.post("/project/:UserId", pushProjectInUser, createProject);
// router.get("/projects/:UserId", getProjectByUserId);
module.exports = router;
