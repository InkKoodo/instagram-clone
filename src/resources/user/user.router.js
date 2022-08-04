import express from 'express';

import userCollectionRouter from './userCollection/userCollection.router';
import {
  deleteUser, getAllUsers, getUser,
  subscribe, unsubscribe, updateBio,
} from './user.controllers';

const router = express.Router();

router.use('/collections', userCollectionRouter);

router.route('/')
  .get(getAllUsers)
  .put(updateBio)
  .delete(deleteUser);

router.route('/:id')
  .get(getUser);

router.post('/subscribe', subscribe);

router.post('/unsubscribe', unsubscribe);

export default router;
