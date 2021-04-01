const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    phonestatus:{
      type: String,
      required: false,
      default: "Not-verify",
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
    projects: [
      {
        type: ObjectId,
        ref: "Projects",
      },
    ],
    profiledata: {},
    role: {
      type: Number,
      default: 0,
    },
    hackathons: [
      {
        type: ObjectId,
        ref: "Hackathon",
      },
    ],
    innotechs: [
      {
        type: ObjectId,
        ref: "Innotech",
      },
    ],
    schemes: [
      {
        type: ObjectId,
        ref: "Scheme",
      },
    ],
    startups: [
      {
        type: ObjectId,
        ref: "Startup",
      },
    ],
    internship: [
      {
        type: ObjectId,
        ref: "Internship",
      },
    ],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
