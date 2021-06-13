const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    InternshipTitle: {
      type: String,
      required: true,
    },
    AvailablePositions: {
      type: String,
      required: true,
    },
    Rewards: {
      type: String,
      required: true,
    },
    positionBreif: {
      type: String,
    },
    Link: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Internship", internshipSchema);
