const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    // 400 bad request
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid email or password1");
    return;
  }

  const token = user.generateAuthToken();
  res.header("x-lifebookgoals-token", token);
  res.send(token);
});

function validate(request) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(7).max(255).required(),
  };

  return Joi.validate(request, schema);
}

module.exports = router;
