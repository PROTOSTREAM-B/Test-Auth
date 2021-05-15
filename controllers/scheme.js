const Scheme = require("../models/scheme");
const User = require("../models/user");
const fs = require('fs');

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
  let img= fs.readFileSync(req.files.image[0].path);
  let file= fs.readFileSync(req.files.files[0].path);
  let encode_img= img.toString('base64');
  let encode_file= file.toString('base64');
  let final_img ={
    contentType: req.files.image[0].mimetype,
    image: Buffer.from(encode_img, 'base64')
  }
  let final_file={
    contentType: req.files.files[0].mimetype,
    file: Buffer.from(encode_file, 'base64')
  }
  console.log(final_file);
  console.log(final_img);
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
      fileLink: final_file,
      imageLink: final_img,
    });
console.log(schemes);
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
