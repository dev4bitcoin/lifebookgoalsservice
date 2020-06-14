const express = require("express");
const error = require("../middleware/error");
const articles = require("../routes/articles");
const tags = require("../routes/tags");
const users = require("../routes/users");
const auth = require("../routes/auth");
const subscribers = require("../routes/subscribers");
module.exports = function (app) {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api/articles", articles);
  app.use("/api/tags", tags);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/subscribers", subscribers);
  app.use(error);
};
