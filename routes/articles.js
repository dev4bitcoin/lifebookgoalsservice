const auth = require("../middleware/auth");
const { Article, validate } = require("../models/article");
const { Tag } = require("../models/tag");
const express = require("express");
const router = express.Router();

const defaultPageNumber = 1;
const defaultPageSize = 6;

router.get("/", async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || defaultPageNumber;
  const pageSize = parseInt(req.query.pageSize) || defaultPageSize;
  const articles = await Article.find()
    .populate("tags", "-lastModifiedTimestamp")
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdTimestamp: -1 });

  const articlesTotalCount = await Article.find().countDocuments();
  res.send({ articles: articles, totalCount: articlesTotalCount });
});

router.get("/archives", async (req, res) => {
  const articles = await Article.find().sort({ createdTimestamp: -1 });
  res.send({ articles: articles });
});

router.get("/byTag/:id", async (req, res) => {
  const id = req.params.id;
  const pageNumber = parseInt(req.query.pageNumber) || defaultPageNumber;
  const pageSize = parseInt(req.query.pageSize) || defaultPageSize;
  const articles = await Article.find({ tags: { _id: id } })
    .populate("tags", "-lastModifiedTimestamp")
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdTimestamp: -1 });

  const articlesTotalCount = await Article.find({
    tags: { _id: id },
  }).countDocuments();
  res.send({ articles: articles, totalCount: articlesTotalCount });
});

router.get("/search/:title", async (req, res) => {
  const title = req.params.title;
  const articles = await Article.find({
    title: { $regex: title, $options: "i" },
  }).sort({
    createdTimestamp: -1,
  });

  res.send(articles);
});

router.get("/featured/", async (req, res) => {
  const articles = await Article.find({
    isFeatured: true,
  })
    .populate("tags", "-lastModifiedTimestamp")
    .sort({
      createdTimestamp: -1,
    });

  res.send(articles);
});

router.get("/popular/", async (req, res) => {
  const articles = await Article.find()
    .populate("tags", "-lastModifiedTimestamp")
    .limit(3)
    .sort({
      visitCount: -1,
      createdTimestamp: -1,
    });

  res.send(articles);
});

router.get("/stub/", (req, res) => {
  const articleStub = {
    title: "",
    description: "",
    image: "",
    imageName: "",
    isFeatured: false,
    relatedArticles: [],
    tags: [],
  };

  res.send(articleStub);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let article = new Article(mapArticle(req.body));
  article = await article.save();
  increaseTaggedCount(article.tags);
  res.send(article);
});

async function increaseTaggedCount(tags) {
  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    await Tag.findByIdAndUpdate(
      tag,
      {
        $inc: { taggedCount: 1 },
      },
      {
        new: true,
      }
    );
  }
}

async function decreaseTaggedCount(tags) {
  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    if (tag.taggedCount === 0) {
      continue;
    }
    await Tag.findByIdAndUpdate(
      tag._id,
      {
        $inc: { taggedCount: -1 },
      },
      {
        new: true,
      }
    );
  }
}

function mapArticle(body) {
  return {
    title: body.title,
    description: body.description,
    image: body.image,
    imageName: body.imageName,
    isFeatured: body.isFeatured,
    relatedArticles: body.relatedArticles,
    tags: body.tags,
  };
}

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const mappedArticle = mapArticle(req.body);

  let article = await Article.findById(req.params.id).populate(
    "tags",
    "-lastModifiedTimestamp"
  );

  if (!article)
    return res.status(404).send("The article with the given Id was not found.");

  decreaseTaggedCount(article.tags);

  article = await Article.findByIdAndUpdate(req.params.id, mappedArticle, {
    new: true,
  }).populate("tags", "-lastModifiedTimestamp");
  increaseTaggedCount(mappedArticle.tags);

  res.send(article);
});

router.delete("/:id", auth, async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article)
    return res.status(404).send("The article with the given Id was not found.");

  decreaseTaggedCount(article.tags);

  await Article.findByIdAndRemove(req.params.id);

  res.send(true);
});

async function updateCount(id) {
  const updatedArticle = await Article.findByIdAndUpdate(
    id,
    {
      $inc: { visitCount: 1 },
    },
    {
      new: true,
    }
  );
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id)
    .populate("tags", "-lastModifiedTimestamp")
    .populate({
      path: "relatedArticles",
      populate: {
        path: "tags",
        select: "-lastModifiedTimestamp",
        model: "Tag",
      },
    });
  if (!article)
    return res.status(404).send("The article with the given Id was not found.");

  updateCount(id);

  const nextArticle = await Article.findOne({ _id: { $gt: id } })
    .sort({ _id: 1 })
    .limit(1);

  const previousArticle = await Article.findOne({ _id: { $lt: id } })
    .sort({ _id: -1 })
    .limit(1);

  const result = {
    currentArticle: article,
    previousArticle: previousArticle,
    nextArticle: nextArticle,
  };

  res.send(result);
});

module.exports = router;
