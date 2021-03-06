require("dotenv").config();
const User = require("../models/user");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var _ = require("lodash");
const { VideoGrant } = require("twilio/lib/jwt/AccessToken");

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
      if (foundUser) {
        return res.json({ error: "Email already registered" });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          const newUser = new User({
            email: req.body.email,
            password: hash,
            number: req.body.number,
            profiledata: profiledata,
            role: 2,
            number: req.body.number,
          });

          newUser.save(function (err, savedUser) {
            if (!err) {
              const token = jwt.sign(
                { _id: newUser._id },
                process.env.SECRET_KEY
              );
              res.cookie("token", token, { expire: new Date() + 7 });
              const {
                _id,
                projects,
                hackathons,
                schemes,
                email,
                profiledata,
                role,
                phonestatus,
                number,
              } = savedUser;

              return res.send({
                token,
                cookies: res.cookies,
                user: {
                  _id,
                  projects,
                  hackathons,
                  email,
                  schemes,
                  profiledata,
                  role,
                  phonestatus,
                  number,
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
  console.log("in login route");
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (err || !foundUser) {
      return res.status(400).json({
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

            res.cookie("token", token);
            console.log(res.headers);

            const {
              _id,
              projects,
              hackathons,
              schemes,
              email,
              profiledata,
              role,
              number,
              phonestatus,
            } = foundUser;

            // req.profile = foundUser;

            return res.send({
              token,
              cookies: res.cookies,
              user: {
                _id,
                projects,
                hackathons,
                email,
                schemes,
                profiledata,
                role,
                number,
                phonestatus,
              },
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
  console.log(req.headers);
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

exports.isAdmin = (req, res, next) => {
  // console.log(req.profile);
  if (req.profile.role === 3) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not admin, Access Denied",
    });
  }
};

exports.isTBI = (req, res, next) => {
  if (req.profile.role === 2) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not TBI Member, Access Denied",
    });
  }
};
