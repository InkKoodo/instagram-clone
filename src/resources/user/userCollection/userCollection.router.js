import express from 'express';

import UserCollection from './userCollection.model';

const router = express.Router();

router.get('/', (req, res) => res.send('user collections'));

export default router;
