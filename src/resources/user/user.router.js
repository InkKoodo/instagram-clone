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
        return res.status(404).json({ error: { message: 'User already exists' } });
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
    try {
      const user = await User.findById(req.params.userId)
        .populate(['followers', 'subscriptions']);

      res.status(200).json({ data: user });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  })
  // update user
  .put()
  // delete user
  .delete(async (req, res) => {
    // todo: jwt
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      console.log(deletedUser);
      if (!deletedUser) {
        return res.status(400).json({ error: { message: 'There\'s no such account' } });
      }
      return res.status(200).json({ data: { message: 'Account was deleted' } });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.post('/subscribe', async (req, res) => {
  try {
    // todo: unsafe operation, change when JWT will be implemented
    const { subscriptionId, userId } = req.body;
    // add account to follow
    await User.findOneAndUpdate(
      { id: userId },
      { $addToSet: { subscriptions: subscriptionId } },
    );
    // add subscriber to a subscribed account
    await User.findOneAndUpdate(
      { id: subscriptionId },
      { $addToSet: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'successfully subscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    // todo: unsafe operation, change when JWT will be implemented
    const { subscriptionId, userId } = req.body;
    // account to unfollow
    await User.findOneAndUpdate(
      { id: userId },
      { $pull: { subscriptions: subscriptionId } },
    );
    // remove subscriber
    await User.findOneAndUpdate(
      { id: subscriptionId },
      { $pull: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'successfully unsubscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
