const express = require("express");
const {
  findAllProjects,
  createProject,
} = require("../controllers/projectController");
const { getUserById } = require("../controllers/user");

const router = express.Router();

router.get("/projects", findAllProjects);
//params..
router.param("UserId", getUserById);

router.post("/project/:UserId", createProject);
// router.get("/projects/:UserId", getProjectByUserId);
module.exports = router;
