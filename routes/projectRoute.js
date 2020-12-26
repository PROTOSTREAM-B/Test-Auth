const express = require("express");
const { isAuthenticated } = require("../controllers/auth");
const {
  findAllProjects,
  createProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/projects", findAllProjects);

router.post("/project/:UserId", createProject);

module.exports = router;
