const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    
      if(file.fieldname==="nda"){
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
                fs.mkdir(dir + '/nda/', (err)=> {
                  if (err){
                    return console.error(err);
                  } else{
                    console.log("nda Directory created.");
                    cb(null, "public/nda");
                  }
                });
              }
            });
          } 
          else {
            console.log("Public Directory exists.")
            fs.access('public/nda', function(error) {
                  if(error) {
                    console.log("nda Directory does not exist!!");
                    fs.mkdir('./public/nda',(err)=>{
                      if(err) {
                        return console.log(err);
                      }
                      else{
                        console.log("nda directory created.");
                        cb(null, "public/nda");
                      }
                    });
                  }
                  else{
                    console.log("nda Directory exists!!");
                    cb(null, "public/nda");
                  }
              });
          }
        });
        
      }
      else if(file.fieldname==="presentation"){
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
  },
  filename: (req, file, cb) => {
      if(file.fieldname==="nda"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
      else if(file.fieldname==="presentation"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
  },
});

const upload = multer({storage: multerStorage});

const { getUserById, getUser } = require("../controllers/user");
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth");
const { createNewStartup, readytoRegister, getStartupById, otplogin, otpverify, isSens, internship } = require("../controllers/startup");

const router = express.Router();

router.param("userId", getUserById);
router.param("startupId", getStartupById);

//router.use("/createstartup",isSens);
router.use("/startup/createinternship/",isSens);



router.get("/startup/:userId",isSignedIn,readytoRegister);
router.post("/startup/register/:userId",isSignedIn,otplogin);
router.post("/startup/verify/:userId",isSignedIn,otpverify);

router.post("/startup/createstartup/:userId",upload.fields(
            [{
              name: 'nda', maxCount: 1
            }, {
              name: 'presentation', maxCount: 1
            }]
            ),isSens,
            isSignedIn,
            createNewStartup,
);


// router.get(
//   "/startup/allStartups",
//   isSignedIn,
//   isAuthenticated,
//   findAllStartups
// );

module.exports = router;
