const express = require("express");

const { getUserById, getUser } = require("../controllers/user");
const {
  isSignedIn,
  isSens,
  isAuthenticated,
} = require("../controllers/auth");
const { createNewStartup, readytoRegister, getStartupById, otplogin, otpverify } = require("../controllers/startup");

const router = express.Router();

router.param("userId", getUserById);
router.param("startupId", getStartupById);

router.use("/startup/createStartup",isSens);



router.get("/startup/:userId",isSignedIn,readytoRegister);
router.post("/startup/register/:userId",isSignedIn,otplogin);
router.post("/startup/verify/:userId",isSignedIn,otpverify);

router.post("/startup/createStartup/NewStartup",isSignedIn,createNewStartup);


// router.get(
//   "/startup/allStartups",
//   isSignedIn,
//   isAuthenticated,
//   findAllStartups
// );

module.exports = router;
