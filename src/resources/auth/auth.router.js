import express from 'express';

import { createUser, verifyUser } from '../user/user.controllers';

const router = express.Router();

router.post('/register', (req, res) => createUser(req, res));

router.post('/login', (req, res) => verifyUser(req, res));

export default router;
