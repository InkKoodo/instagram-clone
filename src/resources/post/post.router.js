import express from 'express';

import Post from './post.model';

const router = express.Router();

// create Post
router.post('/create', async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    res.status(200).json({ data: newPost });
  } catch (err) {
    res.status(400).json({ data: err });
  }
});

// get Post by ID
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate(['createdBy', 'likes']);
  res.json({ data: post });
});

export default router;
