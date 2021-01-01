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
        unique: true,
    },
    Teamname: {
        type: String,
        required: true,
        unique: true,
    },
    Leadername: {
        type: String,
        required: true,
        unique: true,
    },
    Leaderroll: {
        type: String,
        required: true,
        unique: true,
    },
    Leaderbranch: {
        type: String,
        required: true,
    },
    Projectdomain: {
        type: String,
        required: true,
        unique: true,
    },
    Projectsummary: {
        type: String,
        required: true,
    },
    Leaderemailid: {
        type: String,
        required: true,
        unique: true,
    },
    Leadermoblie: {
        type: Number,
        required: true,
        unique: true,
    },
    //array store in single object
    Hackmembers: {},
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Hackathon", hackathonSchema);
