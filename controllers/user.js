const User = require("../models/user");
exports.getUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
  //   User.find(id)
  //     .populate("projects")
  //     .exec((err, user) => {
  //       if (err) {
  //         return res.json({
  //           error: err,
  //         });
  //       }
  //       res.json(user);
  //     });
};

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};
