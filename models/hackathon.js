const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    Currentyear: {
      type: Number,
      required: true,
    },
    Hackname: {
      required: true,
      type: String,
    },
    Teamname: {
      required: true,
      type: String,
    },
    Leadername: {
      required: true,
      type: String,
    },
    Leaderbranch: {
      required: true,
      type: String,
    },
    Projectsummary: {
      required: true,
      type: String,
    },
    Leaderemailid: {
      required: true,
      type: String,
    },
    Leadermoblie: {
      required: true,
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Hackathon", hackathonSchema);
