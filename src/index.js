/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import { verifyToken } from './resources/auth/jwt.controllers';

import userRouter from './resources/user/user.router';
import postRouter from './resources/post/post.router';
import authRouter from './resources/auth/auth.router';

const { DB_URI } = process.env;
const PORT = 3000;

const app = express();

mongoose.connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listen at port: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);

app.use((req, res, next) => verifyToken(req, res, next));
app.use('/users', userRouter);
app.use('/posts', postRouter);
