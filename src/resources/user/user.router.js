import express from 'express';

import User from './user.model';

const router = express.Router();

// /user/:userId
// get one User
router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate(['followers', 'following']);
  res.json({
    data: user,
  });
});

// /user/
// createUser
router.post('/', async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;
    // check if user exists already

    // crypt password (add preSave hook later to model)

    // save user
    const newUser = new User({
      bio: {
        username,
        firstName,
        lastName,
      },
    });

    const saveUser = await newUser.save();

    res.status(200).json({ data: saveUser });
  } catch (err) {
    res.status(400).json({ data: err });
  }
});

export default router;
