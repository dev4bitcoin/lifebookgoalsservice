const Joi = require("joi");
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 512,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
    },
    image: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    postingDate: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    relatedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  { versionKey: false }
);

const Article = mongoose.model("Article", articleSchema);

function validateArticle(article) {
  const schema = {
    title: Joi.string().min(5).max(512).required(),
    description: Joi.string().min(5).required(),
    image: Joi.string().required(),
    imageName: Joi.string().min(3).max(255).required(),
    tags: Joi.array().required(),
  };

  return Joi.validate(article, schema, { allowUnknown: true });
}

exports.Article = Article;
exports.validate = validateArticle;
