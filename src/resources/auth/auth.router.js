import express from 'express';

import { createUser, verifyUser } from '../user/user.controllers';

const router = express.Router();

router.post('/register', createUser);

router.post('/login', verifyUser);

export default router;
