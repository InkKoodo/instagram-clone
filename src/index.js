import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import User from './resources/user/user.model.js';
import Post from './resources/post/post.model.js';

const dbURI = process.env.DB_URI;
const app = express();
const port = 3000;

mongoose.connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`listen at port: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// getOne user
app.get('/users/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate(['followers', 'following']);
  res.json({
    data: user,
  });
});

// createUser
app.post('/users', async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;
    // check if user exists already

    // crypt password (add preSave hook later to model)

    // save user
    const newUser = new User({
      bio: {
        username,
        firstName,
        lastName,
      },
    });

    const saveUser = await newUser.save();

    res.status(200).json({ data: saveUser });
  } catch (err) {
    res.status(400).json({ data: err });
  }
});

app.post('/posts/create', async (req, res) => {
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

app.get('/posts/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId).populate(['createdBy', 'likes']);
  res.json({
    data: post,
  });
});
