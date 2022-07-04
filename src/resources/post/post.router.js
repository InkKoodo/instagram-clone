import express from 'express';

import Post from './post.model';

const router = express.Router();

// /posts/create
router.post('/create', async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    res.status(200).json({ data: newPost });
  } catch (err) {
    res.status(400).json({ data: err });
  }
});

// /posts/:postId
router.get('/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId).populate(['createdBy', 'likes']);
  res.json({ data: post });
});

export default router;
