const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/lifebookgoals", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB"));
};
