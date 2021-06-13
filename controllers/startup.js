require('dotenv/config');
const Internship = require("../models/internship");
const Startup = require("../models/startup");
const User = require("../models/user");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

exports.readytoRegister = (req,res) => {
  res.send({
    name: req.profile.profiledata.Profilename,
    number: req.profile.number,
  })
}


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
  const startup = new Startup(req.body);
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
      }
    );

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

    res.status(200).json(startup);
  });
}
else{
  res.status(400).json({error:"You have not proper register your phone no. for Startup!!"});
}
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
