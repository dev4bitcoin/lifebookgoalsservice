const mongoose = require("mongoose");
const Joi = require("Joi");

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    lastModifiedTimestamp: {
      type: Date,
      default: Date.now,
    },
    taggedCount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const Tag = mongoose.model("Tag", tagSchema);

function validateTag(tag) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(tag, schema);
  return result;
}

exports.tagSchema = tagSchema;
exports.Tag = Tag;
exports.validate = validateTag;
