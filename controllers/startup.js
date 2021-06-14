require('dotenv/config');
const Internship = require("../models/internship");
const Startup = require("../models/startup");
const User = require("../models/user");
const fs = require("fs");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

exports.readytoRegister = (req,res) => {
  res.send({
    name: req.profile.profiledata.Profilename,
    number: req.profile.number,
  })
}


exports.isSens = (req, res, next) => {
  console.log(req.profile);
  if (req.profile.role === 1) {
    next();
  } else {
    return res.json({
      error: "Access Denied",
    });
  }
};


exports.otplogin = (req,res) => {
  //console.log(req.profile.number);
  if (req.profile.number) {
          client.verify.services(process.env.RESET_PASS_SERVICE_ID).verifications
          .create({
              to: `+${req.profile.number}`,
              channel: 'sms'
          })
          .then(data => {
              if(data.status==="pending"){
                  res.status(200).send({data});
              }
              User.findOneAndUpdate(
                  { _id: req.profile._id },
                  { phonestatus: data.status},
                  { new: true },
                  function(err, result) {
                  if (err) {
                      console.log(err);
                  } else {
                      console.log(result);
                  }
                  }
              );
          });   
  }
   else {
      res.status(400).send({
          message: "Wrong number :(",
      });
  }
}


exports.otpverify = (req,res) => {

if ((req.body.code).length === 6) {
  User.findOne({ email: req.body.email })
  .exec((err, user) => {
      if (err) {
      return res.status(400).json({
          error: err,
      });
      }   
      else{
          client.verify.services(process.env.RESET_PASS_SERVICE_ID).verificationChecks
      .create({
          to: `+${req.profile.number}`,
          code: req.body.code
      })
      .then(data => {
          if (data.status === "approved") { 
              res.status(200).send({data});
              User.findOneAndUpdate(
                  { _id: req.profile._id },
                  { phonestatus: data.status , role: 1},
                  function(err, result) {
                      if (err) {
                          console.log(err);
                      } else {
                          console.log(result);
                      }
                  }
              );
          }else{
              res.status(400).send({
                  err: "wrong code",
              })
          }
          });
      }
  });    
} else {
  res.status(400).send({
      message: "Wrong code:(",
  })
}
}




exports.createNewStartup = (req, res) => {


 // console.log(req.profile.PhoneVerfication);
  if(req.profile.phonestatus==="approved"){
    let signedNda = fs.readFileSync(req.files.nda[0].path);
    let presentationFile = fs.readFileSync(req.files.presentation[0].path);
    let encode_signedNda = signedNda.toString("base64");
    let encode_presentationFile = presentationFile.toString("base64");
    let final_signedNda = {
      contentType: req.files.nda[0].mimetype,
      image: Buffer.from(encode_signedNda, "base64"),
    };
    let final_presentationFile = {
      contentType: req.files.presentation[0].mimetype,
      file: Buffer.from(encode_presentationFile, "base64"),
    };
    const {StartupName, StartupDomain, StartupStage, StartupType, FounderName, FounderEmail, AadharNumber, StartupBreif, CofounderName, CofounderEmail, CofounderNumber, Link, ProjectSummary}=req.body;
    const startup = new Startup({
      StartupName,
      StartupDomain,
      StartupStage,
      StartupType,
      FounderName,
      FounderEmail,
      AadharNumber,
      StartupBreif,
      CofounderName,
      CofounderEmail,
      CofounderNumber,
      Link,
      ProjectSummary,
      SignedNda:final_signedNda,
      PresentationFile:final_presentationFile,
    });
  startup.save((err, startup) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { startups: startup } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save hackathon",
          });
        }
        else{
          res.status(200).json(startup);
        }
      }
    ); 
  });
}
else{
  res.status(400).json({error:"You have not proper register your phone no. for Startup!!"});
}
};

exports.internship = (req,res) => {
  const internship = new Internship(req.body);
    internship.save((err, Internship) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { internship: Internship } },
        { new: true },
        (err, updatedUser) => {
          if (err) {
            return res.status(400).json({
              error: "Unable to save hackathon",
            });
          }
        }
      );
    });

};


exports.getStartupById = (req, res) => {
  User.findById({ _id: req.profile._id })
    .populate("startups")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.status(200).json(user.startups);
    });
};

exports.findAllStartups = (req, res) => {
  Startup.find().exec((err, startup) => {
    if (err || !startup) {
      res.status(500).json({
        error: err,
      });
    }

    res.status(200).json(startup);
  });
};
