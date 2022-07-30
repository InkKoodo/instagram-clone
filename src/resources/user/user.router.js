import express from 'express';

import userCollectionRouter from './userCollection/userCollection.router';
import {
  deleteUser, getAllUsers, getUser,
  subscribe, unsubscribe, updateBio,
} from './user.controllers';

const router = express.Router();

router.use('/collections', userCollectionRouter);

router.route('/')
  // get all users
  .get((req, res) => getAllUsers(req, res))

  // update user's bio
  .put((req, res) => updateBio(req, res))

  // delete user
  .delete((req, res) => deleteUser(req, res));

router.route('/:id')
  // get User
  .get((req, res) => getUser(req, res));

router.post('/subscribe', (req, res) => subscribe(req, res));

router.post('/unsubscribe', (req, res) => unsubscribe(req, res));

export default router;
