const Scheme = require("../models/scheme");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");

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
  // console.log("inside scheme route");
  Scheme.find({}, (err, schemes) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(schemes);
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

exports.createNewScheme = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log("error");
      console.log(err);
      return res.status(400).json({
        error: "problem with uploads",
      });
    }

    let scheme = new Scheme(fields);
    scheme.details.data = fs.readFileSync(file.details.path);
    scheme.details.contentType = file.details.type;
    scheme.image.data = fs.readFileSync(file.image.path);
    scheme.image.contentType = file.image.type;

    scheme.save((err, scheme) => {
      if (err) {
        res.status(400).json({
          error: "saving failed",
        });
      }
      res.status(200).json(scheme);
    });
  });
};
