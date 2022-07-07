import express from 'express';

import User from './user.model';
import userCollectionRouter from './userCollection/userCollection.router';

const router = express.Router();

router.use('/collections', userCollectionRouter);

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
  // update user's bio
  .put(async (req, res) => {
    try {
      const { userId } = req.jwtData;
      const { bio } = await User.findById(userId);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio: {
            ...bio,
            ...req.body,
          },
        },
        { new: true },
      );
      return res.status(200).json({ data: { updatedUser } });
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

router.route('/:id')
  // get User
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate(['followers', 'subscriptions']);

      res.status(200).json({ data: user });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

router.post('/subscribe', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const { userId } = req.jwtData;
    // add account to follow
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { subscriptions: subscriptionId } },
    );
    // add subscriber to a subscribed account
    await User.findByIdAndUpdate(
      subscriptionId,
      { $addToSet: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'Successfully subscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const { userId } = req.jwtData;

    // remove account from subscriptions
    await User.findByIdAndUpdate(
      userId,
      { $pull: { subscriptions: subscriptionId } },
    );

    // remove subscriber from followers
    await User.findByIdAndUpdate(
      subscriptionId,
      { $pull: { followers: userId } },
    );
    return res.status(200).json({ data: { message: 'Successfully unsubscribed' } });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
