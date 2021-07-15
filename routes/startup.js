const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    

      if(file.fieldname==="presentation"){
        fs.access("public", function(error) {
          if (error) {
            console.log("Public Directory does not exist!!")
            fs.mkdir('./public/',(err)=>{
              if(err) {
                return console.log(err);
              }
              else{
                console.log("Public Directory created.");
                let dir= './public';
                fs.mkdir(dir + '/presentation/', (err)=> {
                  if (err) {
                    return console.error(err);
                  } else{
                    console.log("File Directory created.");
                    cb(null, "public/presentation");
                  }
                });
              }
            });
          } 
          else {
            console.log("Public Directory exists.")
            fs.access('public/presentation', function(error) {
                  if(error) {
                    console.log("presentation Directory does not exist!!");
                    fs.mkdir('./public/presentation',(err)=>{
                      if(err) {
                        return console.log(err);
                      }
                      else{
                        console.log("presentation directory created.");
                        cb(null, "public/presentation");
                      }
                    });
                  }
                  else{
                    console.log("presentation Directory exists!!");
                    cb(null, "public/presentation");
                  }
              });
          }
        });
      }
      else if(file.fieldname==="uploadnda"){
        fs.access("public", function(error) {
          if (error) {
            console.log("Public Directory does not exist.")
            fs.mkdir('./public/',(err)=>{
              if(err) {
                return console.log(err);
              }
              else{
                console.log("Public Directory created.");
                let dir= './public';
                fs.mkdir(dir + '/uploadnda/', (err)=> {
                  if (err){
                    return console.error(err);
                  } else{
                    console.log("uploadnda Directory created.");
                    cb(null, "public/uploadnda");
                  }
                });
              }
            });
          } 
          else {
            console.log("Public Directory exists.")
            fs.access('public/uploadnda', function(error) {
                  if(error) {
                    console.log("uploadnda Directory does not exist!!");
                    fs.mkdir('./public/uploadnda',(err)=>{
                      if(err) {
                        return console.log(err);
                      }
                      else{
                        console.log("uploadnda directory created.");
                        cb(null, "public/uploadnda");
                      }
                    });
                  }
                  else{
                    console.log("uploadnda Directory exists!!");
                    cb(null, "public/uploadnda");
                  }
              });
          }
        });
      }
  },
  filename: (req, file, cb) => {
      if(file.fieldname==="nda"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
      else if(file.fieldname==="presentation"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
      else if(file.fieldname==="uploadnda"){
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
  },
});


const upload = multer({storage: multerStorage});

const { getUserById, getUser } = require("../controllers/user");
const {
  isSignedIn,
  isAuthenticated,
  isTBI,
} = require("../controllers/auth");
const { createNewStartup, readytoRegister, getStartupById, otplogin, otpverify, isSens, ndaUpload, findAllUserNdas, findAllNdas, getNda, getNdaById, verifyNda, isNdaVerify, internship, findAllStartups } = require("../controllers/startup");

const {createNewInternship} = require("../controllers/internship");

const router = express.Router();

router.param("userId", getUserById);
router.param("startupId", getStartupById);
router.param("ndaId", getNdaById);

router.post(
  "/startup/PhoneLogin/:userId",
  // isSignedIn,
  isSens,
  PhoneLogin
);

router.post(
  "/startup/:PhoneLoginNumber/PhoneVerify/:userId",
  // isSignedIn,
  isSens,
  PhoneVerify
);


router.post(
  "/startup/createStartup/:userId",
  // isSignedIn,
  isSens,
  createNewStartup
);
router.get(
  "/startup/allStartups",
  // isSignedIn,
  // isAuthenticated,
  findAllStartups
);

module.exports = router;
