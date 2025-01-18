// backend (Express) example
const express = require('express');
// const Post = require('./models/Post');
const router = express.Router();

// Get all posts
router.get('/api/posts', async (req, res) => {
  // try {
  //   // const posts = await Post.find();
  //   res.json(['asdf']);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
});

module.exports = router;
