require('dotenv/config');
const User = require("../models/user");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Login Endpoint
exports.otplogin=(req,res) => {
    // console.log(req.body.phonenumber);
    // console.log(req.body.channel);
    console.log(req.profile.phonestatus);
     if (req.body.phonenumber) {
        client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+${req.body.phonenumber}`,
            channel: req.body.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            
            
            if(data.status==="pending"){
                res.status(200).send({
                    message: "Verification is sent!!",
                    phonenumber: req.body.phonenumber,
                    data
                });
                User.findOneAndUpdate(
                    { _id: req.profile._id },
                    { phonestatus: data.status },
                    { new: true },
                    function(err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(result);
                        console.log(req.profile.phonestatus);
                      }
                    }
                  );
            }
            console.log(data.status);
        });
        // if(data.status==="pending"){
        //     console.log(data.status);
        //     User.findByIdAndUpdate(
        //         { _id: req.profile._id },
        //         { phonestatus: "pending" },
        //         { upsert: true },
        //         function(err, result) {
        //           if (err) {
        //             console.log(err);
        //           } else {
        //             console.log(result);
        //             console.log(req.profile.phonestatus);
        //           }
        //         }
        //       );
        // }
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.body.phonenumber,
            data
        });
     }
};

// Verify Endpoint
exports.otpverify=(req, res) => {
    console.log(req.profile._id);
    console.log(req.profile.phonestatus);
    if (req.body.phonenumber && (req.body.code).length === 6) {
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.body.phonenumber}`,
                code: req.body.code
            })
            .then(data => {
                if (data.status === "approved") {
                    
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    });
                    User.findOneAndUpdate(
                        { _id: req.profile._id },
                        { phonestatus: data.status },
                        { new: true },
                        function(err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(result);
                            console.log(req.profile.phonestatus);
                          }
                        }
                      );
                }
                else if (data.status === "approved") {
                    
                }
            });
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.body.phonenumber,
            data
        })
    }
};