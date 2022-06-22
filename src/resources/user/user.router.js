import express from 'express';

import User from './user.model';

const router = express.Router();

router.route('/')
// create User
  .post(async (req, res) => {
    const { username } = req.body.bio;
    try {
      // check if user exists already
      const user = await User.findOne({ 'bio.username': username });
      if (user) {
        return res.status(404).json({ errMessage: 'User already exists' });
      }

      // save user
      const newUser = await User.create(req.body);
      const { _doc } = newUser;
      const { password, ...responseUser } = _doc;
      return res.status(200).json({ data: responseUser });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  // get all users
  .get(async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json({ data: users });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.route('/:userId')
  // get User
  .get(async (req, res) => {
    const user = await User.findById(req.params.userId)
      .populate(['followers', 'following']);
    res.json({ data: user });
  })
  // update user
  .put()
  // delete user
  .delete();

export default router;
