require("dotenv").config();
const User = require("../models/user");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var _ = require("lodash");

// const client = require("twilio")(
//   process.env.ACCOUNT_SID,
//   process.env.AUTH_TOKEN
// );

// console.log(process.env.ACCOUNT_SID);
// console.log(process.env.AUTH_TOKEN);
// console.log(process.env.SERVICE_ID);

exports.register = (req, res) => {
  console.log("inside register");
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
              console.log(res.cookie);
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

exports.otpsend = (req, res) => {
  if (req.body.phonenumber) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+$91{req.body.phonenumber}`,
        channel: req.body.channel === "call" ? "call" : "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.body.phonenumber,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.body.phonenumber,
      data,
    });
  }
};

exports.otpverify = (req, res) => {
  if (req.body.phonenumber && req.body.code.length === 4) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+${req.body.phonenumber}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is Verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number or code :(",
      phonenumber: req.body.phonenumber,
      data,
    });
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
            res.cookie("token", token, { expire: new Date() + 7 });

            const {
              _id,
              projects,
              hackathons,
              schemes,
              email,
              profiledata,
              role,
            } = foundUser;
            return res.status(200).json({
              token,
              user: {
                _id,
                projects,
                hackathons,
                email,
                schemes,
                profiledata,
                role,
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

exports.isSignedIn = (req, res, next) => {
  console.log(req.headers);
  next();
};

// exports.isSignedIn = (req,res,next)=>{
//   const userProfile = JSON.parse(Buffer.from(req.headers.cookie.split('=')[1].split('.')[1], 'base64').toString('utf-8'));
//   User.findOne({
//       email : userProfile.userMail
//   }).exec((err, user) => {
//       if (user.role != 1) {
//           return res.render('default/msg',{
//               message:"Access denied!"
//           });
//       }
//       else {
//           next();
//       }
//   });
// };

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

exports.isAdmin = (req, res, next) => {
  console.log(req.profile);
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

exports.isSens = (req, res, next) => {
  if (req.profile.role === 1) {
    next();
  } else {
    return res.json({
      error: "Access Denied",
    });
  }
};
