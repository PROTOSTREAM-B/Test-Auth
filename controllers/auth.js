const User = require("../models/user");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.register = (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    console.log(foundUser);
    if (foundUser) {
      return res.json({ error: "Email already registered" });
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        //console.log(newUser);
        newUser.save(function (err) {
          if (!err) {
            const token = jwt.sign(
              { _id: newUser._id },
              process.env.SECRET_KEY
            );
            res.cookie("token", token, { expire: new Date() + 7 });
            return res.status(400).json({
              message: "User got registered",
              Userdata: newUser,
              Usertoken: token,
            });
          } else {
            return res.status(400).json({
              error: err,
            });
          }
        });
      });
    }
  });
};

exports.login = (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    console.log(foundUser);
    if (err || !foundUser) {
      return res.json({
        error: err,
      });
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            const token = jwt.sign(
              { _id: foundUser._id },
              process.env.SECRET_KEY
            );
            res.cookie("token", token, { expire: new Date() + 7 });
            //console.log(token);
            return res.status(200).json(foundUser);
          } else {
            return res.status(401).json({
              error: "Email or password do not match",
            });
          }
        });
      }
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "User signout Successfully",
  });
};

exports.isAuthenticated = (req, res, next) => {
  console.log("REQ.PROFILE", req.profile);
  console.log("REQ.AUTH", req.auth);
  // console.log("REQ.PROFILE._ID", req.profile._id);
  console.log("REQ.AUTH_ID", req.auth._id);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
      hii: "here is the error",
    });
  }
  next();
};
