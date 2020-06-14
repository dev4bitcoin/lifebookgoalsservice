const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 1024,
    },
    createdTimestamp: { type: Date, default: Date.now },
    lastLoginTimestamp: { type: Date },
  },
  { versionKey: false }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(7).max(255).required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
