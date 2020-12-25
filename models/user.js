const mongoose = require("mongoose");

const userSchema=new mongoose.Schema(
  {
  name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
},
{ timestamps: true }
);


module.exports=new mongoose.model("User",userSchema);