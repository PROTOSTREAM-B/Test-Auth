const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const hackathonSchema = new mongoose.Schema(
  {
    Currentyear: {
      type: Number,
      required: true,
    },
    Hackname: {
      type: String,
      required: true,
    },
    Teamname: {
      type: String,
      required: true,
    },
    Leadername: {
      type: String,
      required: true,
    },
    Leaderroll: {
      type: String,
      required: true,
    },
    Leaderbranch: {
      type: String,
      required: true,
    },
    Projectdomain: {
      type: String,
      required: true,
    },
    Projectsummary: {
      type: String,
      required: true,
    },
    Leaderemailid: {
      type: String,
      required: true,
    },
    Leadermoblie: {
      type: Number,
      required: true,
    },
    //array store in single object
    Hackmembers: {},
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Hackathon", hackathonSchema);
