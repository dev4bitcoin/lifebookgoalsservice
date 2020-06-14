const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Subscriber, validate } = require("../models/subscriber");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const subscribers = await Subscriber.find();
  res.send(subscribers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    // 400 bad request
    res.status(400).send(error.details[0].message);
    return;
  }

  let subscriber = await Subscriber.findOne({ email: req.body.email });

  if (subscriber) {
    res.status(400).send("Email is already registered");
    return;
  }

  subscriber = new Subscriber(_.pick(req.body, ["email"]));

  await subscriber.save();
  res.send(_.pick(subscriber, ["email"]));
});

module.exports = router;
