import express from 'express';

import UserCollection from './userCollection.model';

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
      return res.status(200).json({ data: newCollection });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.route('/:id')

  // edit collection
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
  .get(async (req, res) => res.send('user collections'))

  // delete collection
  .delete(async (req, res) => res.send('user collections'));

// add to collection

// remove from collection

// add co-editors

// remove co-editors

export default router;
