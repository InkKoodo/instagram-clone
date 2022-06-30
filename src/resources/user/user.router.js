import express from 'express';

import User from './user.model';

const router = express.Router();

router.route('/')
  // get all users
  .get(async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json({ data: users });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  // delete user
  .delete(async (req, res) => {
    // todo: add "post deletion data query" to remove all its user data from other users
    try {
      const { userId } = req.jwtData;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(400).json({ error: { message: 'There\'s no such account' } });
      }
      return res.status(200).json({ data: { message: 'Account was deleted' } });
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
  .put();

router.post('/subscribe', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const { userId } = req.jwtData;
    // add account to follow
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { subscriptions: subscriptionId } },
    );
    // add subscriber to a subscribed account
    await User.findOneAndUpdate(
      { _id: subscriptionId },
      { $addToSet: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'successfully subscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const { userId } = req.jwtData;

    // remove account from subscriptions
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { subscriptions: subscriptionId } },
    );

    // remove subscriber from followers
    await User.findOneAndUpdate(
      { _id: subscriptionId },
      { $pull: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'successfully unsubscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
