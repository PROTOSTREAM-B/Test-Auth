const Hackathon = require("../models/hackathon");
const User = require("../models/user");

exports.getHackYear = (req, res, next, id) => {
  // get selected year
  next();
};

exports.findAllHackathons = (req, res, next, id) => {
  let year = req.body.year;

  // static years
  switch (year) {
    case "2018":
      Hackathons.find(year, (err, hackathonproject) => {
        if (err) {
          return res.json(404).json({
            error: err,
          });
        }
        res.status(200).json(hackathonproject);
      });
      break;
    case "2019":
      Hackathons.find(year, (err, hackathonproject) => {
        if (err) {
          return res.json(404).json({
            error: err,
          });
        }
        res.status(200).json(hackathonproject);
      });
      break;
    case "2020":
      Hackathons.find(year, (err, hackathonproject) => {
        if (err) {
          return res.json(404).json({
            error: err,
          });
        }
        res.status(200).json(hackathonproject);
      });
      break;
  }
  next();
};

exports.createNewHackathon = (req, res) => {
  let hackathons = [];
  const hackthon = new Hackathon(req.body);

  hackthon.save((err, hackathon) => {
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
