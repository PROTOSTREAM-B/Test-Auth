require("dotenv").config();

module.exports = {
  serviceId: process.env.serviceID, // Your Accout Service ID from Protostream Project
  accountSid: process.env.accountSID, // Your Account SID from www.twilio.com/console
  authToken: process.env.authTOKEN, // Your Auth Token from www.twilio.com/console
};
