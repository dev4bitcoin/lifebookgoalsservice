const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/lifebookgoals", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB.."));
};
