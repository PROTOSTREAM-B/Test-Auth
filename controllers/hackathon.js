const Hackathon = require("../models/hackathon");
const User = require("../models/user");

exports.getHackathonOfUser = (req, res) => {
  console.log("inside getHackathonOfUser");
  User.findById({ _id: req.profile._id })
    .populate("hackathons")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.status(200).json(user.hackathons);
    });
};
exports.getHackathonById = (req, res, next, id) => {
  console.log("in getUserById");
  Hackathon.findById(id).exec((err, hackathon) => {
    if (err || !hackathon) {
      return res.status(400).json({
        error: "No Hackathon was found in DB",
      });
    }
    req.hackathon = hackathon;
    next();
  });
};

exports.findAllHackathons = (req, res) => {
  Hackathon.find().exec((err, hackathons) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(hackathons);
  });
};

exports.createNewHackathon = (req, res) => {
  let hackathons = [];
  const hackathon = new Hackathon(req.body);
  console.log(hackathon);
  hackathon.save((err, hackathon) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }

    hackathons.push(hackathon);

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { hackathons: hackathons } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save hackathon",
          });
        }
      }
    );

    res.status(200).json(hackathon);
  });
};

exports.DeleteHackathon = (req, res) => {
  let hackathon = req.hackathon;
  console.log(req.hackathon);
  hackathon.remove((err, deletedHackathon) => {
    if (err || !deletedHackathon) {
      res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "hackathon deleted",
      deletedHackathon,
    });
  });
};
