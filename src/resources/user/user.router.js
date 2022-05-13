import express from 'express';

import User from './user.model';

const router = express.Router();

// /user/:userId
// get one User
router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate(['followers', 'following']);
  res.json({ data: user });
});

// /user/
// createUser
router.post('/', async (req, res) => {
  const { username } = req.body;
  try {
    // check if user exists already
    const ifUserExists = await User.findOne({ username });
    if (ifUserExists) {
      res.status(404).json({ errMessage: 'User already exists' });
    }
    // crypt password (add preSave hook later to model)

    // save user
    const newUser = await User.create(req.body);

    res.status(200).json({ data: newUser });
  } catch (err) {
    res.status(400).json({ data: err });
  }
});

export default router;
