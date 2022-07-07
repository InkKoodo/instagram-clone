import express from 'express';

import Post from './post.model';
import User from '../user/user.model';

const router = express.Router();

router.route('/')
  // create a Post
  .post(async (req, res) => {
    try {
      const { userId } = req.jwtData;
      const newPost = await Post.create({
        createdBy: userId,
        ...req.body,
      });
      const { _id } = newPost;
      // add post to User
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { posts: _id } },
      );

      res.status(200).json({ data: newPost });
    } catch (e) {
      res.status(400).json({ data: e });
    }
  });

// get all user's Posts

router.route('/:id')
  // get Post by ID
  .get(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate(['createdBy', 'likes', 'parentCollections']);
    res.json({ data: post });
  });
// update Post

// delete Post

// save post to Collections (pass an array of collections)

// remove post from Collections
export default router;
