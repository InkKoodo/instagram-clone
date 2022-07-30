import express from 'express';

import { createPost, getAllPosts, getPost } from './post.controllers';

const router = express.Router();

router.route('/')
  // create a Post
  .post((req, res) => createPost(req, res))

  // get all user's Posts
  .get((req, res) => getAllPosts(req, res));

router.route('/:id')
  // get Post by ID
  .get((req, res) => getPost(req, res));
// update Post

// delete Post

// save post to Collections (pass an array of collections)

// remove post from Collections
export default router;
