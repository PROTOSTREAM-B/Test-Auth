const User = require("../models/user");
const mongoose = require("mongoose");

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
                profiledb: {
                  Profilename: proname,
                  ProfileID: proid,
                  ProfileBranch: probranch,
                  ProfileYear: proyear,
                },
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
  } else {
    return res.status(400).json("Invalid Email id");
  }
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
