const Scheme = require("../models/scheme");
const User = require("../models/user");

// ERROR: DISSCUSS ON WHATSAPP

exports.getSchemeById = (req, res, next, id) => {
  console.log("in getSchemeById");
  Scheme.findById(id).exec((err, scheme) => {
    if (err || !scheme) {
      return res.status(400).json({
        error: "No Scheme was found in DB",
      });
    }
    req.scheme = scheme;
    next();
  });
};

exports.findallSchemes = (req, res) => {
  console.log("inside scheme route");
  Scheme.find({}, (err, schemes) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(schemes);
  });
};

exports.createNewScheme = (req, res) => {
  const scheme = new Scheme(req.body);
  const user = req.profile;
  scheme.user = user;

  scheme.save((err, scheme) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    let schemes = [];
    schemes.push({
      _id: scheme._id,
      compTitle: req.body.compTitle,
      organizer: req.body.organizer,
      deadline: req.body.deadline,
      starting: req.body.starting,
      ending: req.body.ending,
      registrationLink: req.body.registrationLink,
      // fileLink: req.bdoy.fileLink,
      // imageLink: req.body.imageLink,
    });

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { schemes: schemes } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.json({
            error: err,
          });
        }
      }
    );

    res.status(200).json(scheme);
  });
};

exports.DeleteScheme = (req, res) => {
  let scheme = req.scheme;
  console.log(req.scheme);
  scheme.remove((err, deletedScheme) => {
    if (err || !deletedScheme) {
      res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "scheme deleted",
      deletedScheme,
    });
  });
};
