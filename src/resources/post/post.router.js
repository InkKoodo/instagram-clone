import express from 'express';

import Post from './post.model';

const router = express.Router();

// /posts/create
router.post('/create', async (req, res) => {
  try {
    const { createdBy, media, description } = req.body;

    const newPost = new Post({
      createdBy,
      media,
      description,
    });

    const savePost = await newPost.save();
    res.status(400).json({ data: savePost });
  } catch (err) {
    res.status(200).json({ data: err });
  }
});

// /posts/:postId
router.get('/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId).populate(['createdBy', 'likes']);
  res.json({
    data: post,
  });
});

export default router;
