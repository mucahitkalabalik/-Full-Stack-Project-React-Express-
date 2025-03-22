const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    role: {
      type: String,
      default: "admin",
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
