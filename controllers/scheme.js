const Scheme = require("../models/scheme");
const User = require("../models/user");

exports.findallSchemes = (req, res, next) =>{
    Scheme.find().exec((err, schemes) => {
        if (err) {
          return res.json({
            error: err,
          });
        }
        res.status(200).json(schemes);
      });
};

exports.createNewScheme = (req, res, next) =>{
    let schemes = [];
    const scheme = new Scheme(req.body);
    scheme.save((err, scheme) => {
        if (err) {
        res.status(500).json({
            error: err,
        });
        }
        schemes.push(scheme);
    });
};