const User = require("../models/user");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var _ = require("lodash");

//  localhost:8000/register---->email----->password
//  localhost:8000/login----->email------>password

exports.register = (req, res) => {
  let regx = /^([a-z]+)(\.)([0-9]{4})([a-z]{2})([0-9]{4})(@)(kiet)(\.)(edu)$/;
  if (regx.test(req.body.email)) {
    let testemail = req.body.email;
    let data = _.capitalize(testemail).split(".");
    let proname = data[0];
    let proid = data[1].split("@")[0];
    let probranch = proid.slice(4, 6);
    let proyear = "20" + proid.slice(0, 2) + "-" + proid.slice(2, 4);
    let profiledata = {
      Profilename: proname,
      ProfileID: proid,
      ProfileBranch: probranch,
      ProfileYear: proyear,
    };

    User.findOne({ email: req.body.email }, function (err, foundUser) {
      console.log(foundUser);
      if (foundUser) {
        return res.json({ error: "Email already registered" });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          const newUser = new User({
            email: req.body.email,
            password: hash,
            profiledata: profiledata,
          });
          newUser.save(function (err) {
            if (!err) {
              const token = jwt.sign(
                { _id: newUser._id },
                process.env.SECRET_KEY
              );
              res.cookie("token", token, { expire: new Date() + 7 });
              return res.status(400).json({
                message: "User got registered",
                Userdata: {
                  name: proname,
                  email: newUser.email,
                  _id: newUser._id,
                },
                profiledb: {
                  Profilename: proname,
                  ProfileID: proid,
                  ProfileBranch: probranch,
                  ProfileYear: proyear,
                },
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
  } else {
    return res.status(400).json("Invalid Email id");
  }
};

exports.login = (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (err || !foundUser) {
      return res.status(404).json({
        error: err || "User not found",
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
            const { _id, projects, hackathons, email, profiledata } = foundUser;
            return res.status(200).json({
              token,
              user: { _id, projects, hackathons, email, profiledata },
            });
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

// protected Routes..
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET_KEY,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  console.log(req.profile);
  console.log(req.auth);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};
