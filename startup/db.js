const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("db") || "mongodb://localhost/lifebookgoals", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB.."));
};
