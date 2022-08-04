import express from 'express';

import { createCollection, getCollection, updateCollection } from './userCollection.controllers';

const router = express.Router();

router.route('/')
  .post(createCollection);

router.route('/:id')
  .put(updateCollection)
  .get(getCollection)
  .delete(async (req, res) => res.send('add delete collection'));

// add to collection

// remove from collection

// add co-editors

// remove co-editors

export default router;
