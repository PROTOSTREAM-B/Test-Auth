require('dotenv/config');
const User = require("../models/user");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Login Endpoint
exports.otplogin=(req,res) => {
    console.log("in otp login route");
    // console.log(req.body.channel);
   // console.log(req.profile.phonestatus);
     if (req.body.phonenumber) {
         if(req.profile.sid===null && req.profile.verification===false){
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
                    { phonestatus: data.status, sid: data.sid, verification: false },
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
            else{
    
            }
            console.log(data.status);
        });
    } else{
        res.status(404).send({ 
            message: "OTP already sent or you are already verified!!",
        });
    }
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.body.phonenumber,
        });
     }
};

// Verify Endpoint
exports.otpverify=(req, res) => {
    console.log("in otp verify route");
    //console.log(req.profile.phonestatus);
    if (req.body.phonenumber && (req.body.code).length === 6) {
        if(req.profile.verification===false){
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.body.phonenumber}`,
                code: req.body.code
            })
            .then(data => {
                if (data.status === "approved" && data.sid===req.profile.sid) {
                    
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    });
                    User.findOneAndUpdate(
                        { _id: req.profile._id },
                        { phonestatus: data.status, verification: true },
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
               else{
                   res.status(400).send({
                       message: "Using wrong sid or not request otp for verification or wrong otp",
                   })
               }
            });
        } else{
            res.status(400).send({
                message: "You are already verified!!",
            });
        }
    } else {
        res.status(400).send({
            message: "Wrong phone number or code:(",
            phonenumber: req.body.phonenumber,
        })
    }
};