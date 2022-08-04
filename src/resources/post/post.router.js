import express from 'express';

import { createPost, getAllPosts, getPost } from './post.controllers';

const router = express.Router();

router.route('/')
  .post(createPost)
  .get(getAllPosts);

router.route('/:id')
  .get(getPost);
// update Post

// delete Post

// save post to Collections (pass an array of collections)

// remove post from Collections
export default router;
