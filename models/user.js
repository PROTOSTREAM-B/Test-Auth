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
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
