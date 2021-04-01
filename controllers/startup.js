const Internship = require("../models/internship");
const Startup = require("../models/startup");
const User = require("../models/user");




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
