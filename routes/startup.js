const express = require("express");

const { getUserById, getUser } = require("../controllers/user");
const {
  isSignedIn,
  isAdmin,
  isTBI,
  isSens,
  isAuthenticated,
} = require("../controllers/auth");
const { createNewStartup } = require("../controllers/startup");

const router = express.Router();

router.param("userId", getUserById);
router.param("startupId", getStartupById);

router.post(
  "/startup/createStartup/:userId",
  isSignedIn,
  isSens,
  createNewStartup
);
router.get(
  "/startup/allStartups",
  isSignedIn,
  isAuthenticated,
  findAllStartups
);

module.exports = router;
