const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
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
    projects: [
      {
        type: ObjectId,
        ref: "Projects",
      },
    ],
    profiledata: {},
    hackathons: [
      {
        type: ObjectId,
        ref: "Hackathon",
      },
    ],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
