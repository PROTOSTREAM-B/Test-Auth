const Scheme = require("../models/scheme");
const User = require("../models/user");


exports.getSchemeById = (req, res, next, id) => {
  console.log("in getSchemeById");
  Scheme.findById(id).exec((err, scheme) => {
    if (err || !scheme) {
      return res.status(400).json({
        error: "No Hackathon was found in DB",
      });
    }
    req.scheme = scheme;
  });
  next();
};

exports.findallSchemes = (req, res) => {
  console.log("inside scheme route");
  Scheme.find().exec((err, schemes) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(schemes);
  });
};

exports.createNewScheme = (req, res) => {
  let schemes = [];
  const scheme = new Scheme(req.body);
  console.log(scheme);
  scheme.save((err, scheme) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    res.status(200).json(scheme);
    schemes.push(scheme);
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