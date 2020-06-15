const mongoose = require("mongoose");
const Joi = require("joi");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, minlength: 3, maxlength: 255 },
  },
  { versionKey: false }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

function validateSubscriber(subscriber) {
  const schema = {
    email: Joi.string().email().min(3).max(255).required(),
  };
  const result = Joi.validate(subscriber, schema);
  return result;
}

exports.Subscriber = Subscriber;
exports.validate = validateSubscriber;
