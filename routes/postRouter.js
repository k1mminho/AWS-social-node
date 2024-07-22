const router = require("express").Router();
const models = require("../models");

router.get("/api/post", async (req, res) => {
  const result = await models.Post.findAll();
  res.send(result);
});

router.get("/api/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const result = await models.Post.findOne({ where: { postId } });
  res.send(result);
});

module.exports = router;
