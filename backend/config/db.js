const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
      "mongodb+srv://1999mucahit:12345.Mk@e-commmerce.9krzn.mongodb.net/"
    )
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection error", err);
    });
};

module.exports = db;
