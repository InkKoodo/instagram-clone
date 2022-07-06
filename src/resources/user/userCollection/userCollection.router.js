import express from 'express';

import UserCollection from './userCollection.model';
import User from '../user.model';

const router = express.Router();

router.route('/')
  // create collection
  .post(async (req, res) => {
    try {
      const { userId } = req.jwtData;
      const newCollection = await UserCollection.create({
        owner: userId,
        ...req.body,
      });
      // update user with a new collection id
      const { _id } = newCollection;
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { userCollections: _id } },
        { new: true },
      );

      return res.status(200).json({ data: newCollection });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.route('/:id')

  // update collection
  .put(async (req, res) => {
    try {
      const collectionId = req.params.id;
      const { userId } = req.jwtData;
      const { owner } = await UserCollection.findById(collectionId);

      if (userId !== owner.toString()) {
        return res.status(400).json({ error: { message: 'Only owner can change this settings' } });
      }

      const updatedCollection = await UserCollection.findByIdAndUpdate(
        collectionId,
        req.body,
        {
          new: true,
          populate: ['owner', 'media', 'coEditors'],
        },
      );
      return res.status(200).json({ data: updatedCollection });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })

  // get collection by its id
  .get(async (req, res) => {
    try {
      const collectionId = req.params.id;
      const collection = await UserCollection.findById(collectionId)
        .populate(['media', 'coEditors', 'owner']);

      return res.status(200).json({ data: collection });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })

  // delete collection
  .delete(async (req, res) => res.send('user collections'));

// add to collection

// remove from collection

// add co-editors

// remove co-editors

export default router;
