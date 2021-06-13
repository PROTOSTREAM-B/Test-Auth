const Hackathon = require("../models/hackathon");
const User = require("../models/user");

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

exports.deleteAHackathon = (req, res) => {
  const userId = req.profile._id;
  User.findOneAndDelete({ _id: userId }).exec((err, updatedUser) => {
    if (err || !updatedUser) {
      return res.status(500).json({
        error: err || "error",
      });
    }
    res.status(200).json(updatedUser);
  });
};
