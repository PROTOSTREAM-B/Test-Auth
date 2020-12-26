const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
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
    projects: {
      type: ObjectId,
      ref: "Projects",
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
