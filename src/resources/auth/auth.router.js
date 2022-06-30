import express from 'express';

import { createUser, verifyUser } from '../user/user.controllers';

const router = express.Router();

router.post('/sign-up', (req, res) => createUser(req, res));

router.post('/sign-in', (req, res) => verifyUser(req, res));

export default router;
