import express from 'express';

import { createCollection, getCollection, updateCollection } from './userCollection.controllers';

const router = express.Router();

router.route('/')
  // create collection
  .post((req, res) => createCollection(req, res));

router.route('/:id')

  // update collection
  .put((req, res) => updateCollection(req, res))

  // get collection by its id
  .get((req, res) => getCollection(req, res))

  // delete collection
  .delete(async (req, res) => res.send('user collections'));

// add to collection

// remove from collection

// add co-editors

// remove co-editors

export default router;
