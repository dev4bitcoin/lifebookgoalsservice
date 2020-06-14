const auth = require("../middleware/auth");
const { Tag, validate } = require("../models/tag");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const tags = await Tag.find();
  res.send(tags);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    // 400 bad request
    res.status(400).send(error.details[0].message);
    return;
  }
  const tag = { name: req.body.name };
  const newTag = new Tag({
    name: tag.name,
  });

  const result = await newTag.save({ new: true });
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const { error } = validate(req.body);

  if (error) {
    // 400 bad request
    return res.status(400).send(error.details[0].message);
  }

  const tag = await Tag.findById(id);
  if (!tag) return res.status(400).send("Update failed. Invalid tag id.");

  const result = await Tag.findByIdAndUpdate(
    id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );
  res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const tag = await Tag.findById(id);
  if (!tag) return res.status(400).send("Delete failed. Invalid tag id.");

  if (tag.taggedCount > 0) {
    return res
      .status(400)
      .send(`Delete failed. ${tag.name} is referred in the articles.`);
  }

  await Tag.findByIdAndDelete(id);
  res.send(true);
});

module.exports = router;
