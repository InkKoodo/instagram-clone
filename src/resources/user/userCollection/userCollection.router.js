import express from 'express';

import UserCollection from './userCollection.model';

const router = express.Router();

router.route('/')
  // create collection
  .post(async (req, res) => {
    try {
      const user = req.jwtData.userId;
      const newCollection = await UserCollection.create({
        ownerId: user,
        ...req.body,
      });
      return res.status(200).json({ data: newCollection });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.route('/:id')
  // edit collection base properties
  .put(async (req, res) => res.send('user collections'))

  // get collection by its id
  .get(async (req, res) => res.send('user collections'))

  // delete collection
  .delete(async (req, res) => res.send('user collections'));

// add to collection

// remove from collection

export default router;
