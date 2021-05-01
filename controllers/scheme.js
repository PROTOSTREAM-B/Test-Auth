const Scheme = require("../models/scheme");
const User = require("../models/user");

// ERROR: NEW ERROR

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
 // console.log(req);
 // console.log(req.files);
  console.log(req.files.files);
  console.log(req.files.image);
  console.log(req.files.files[0].path);   //path have to save as a string
  console.log(req.files.image[0].path);   //path have to save as a string
  let filepath=req.files.files;
  let imagepath=req.files.image;
  const scheme = new Scheme(req.body);
  schemeid=scheme._id;
  const user = req.profile;
  scheme.user = user;

  scheme.save((err, scheme) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }

    let newdata={
      "_id": schemeid,
      "compTitle": req.body.compTitle,
      "organizer": req.body.organizer,
      "deadline": req.body.deadline,
      "starting": req.body.starting,
      "ending": req.body.ending,
      "registrationLink": req.body.registrationLink,
      "files": filepath,    //ERROR ON POSTMAN-- Validation Error, Entity not saving in db
      "image": imagepath,   //ERROR ON POSTMAN-- Validation Error, Entity not saving in db
    };

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { schemes: newdata } },
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
