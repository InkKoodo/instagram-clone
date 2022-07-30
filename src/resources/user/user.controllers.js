import bcrypt from 'bcrypt';

import User from './user.model';

import { createToken } from '../auth/jwt.controllers';

export const createUser = async (req, res) => {
  const { username } = req.body.bio;
  try {
    // check if user exists already
    const user = await User.findOne({ 'bio.username': username });
    if (user) {
      return res.status(404).json({ error: { message: 'Try to use different name' } });
    }

    // save user
    const newUser = await User.create(req.body);
    const { _doc } = newUser;
    const { password, _id, ...responseUser } = _doc;
    // create & return token
    const token = await createToken({ userId: _id });
    await res.set('x-auth-token', token);

    return res.status(200).json({ data: responseUser });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const verifyUser = async (req, res) => {
  // validate received data todo: check Validation later
  const { username, password } = req.body;

  try {
    // check user's existence
    const user = await User.findOne({ 'bio.username': username }).select('+password');
    const { password: hashPassword, _id } = user;

    if (!user) {
      return res.status(400).json(
        { error: { message: 'Ether name or password were incorrect, please try again' } },
      );
    }

    // validate received password
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    // if incorrect - return
    if (!isPasswordValid) {
      return res.status(400).json(
        { error: { message: 'Ether name or password were incorrect, please try again' } },
      );
    }
    // send to user new token
    const token = await createToken({ userId: _id });
    await res.set('x-auth-token', token);

    return res.status(200).end();
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate(['followers', 'subscriptions']);

    res.status(200).json({ data: user });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const updateBio = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
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
};

export const subscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const { userId } = req.jwtData;

    // check if user with this id exists
    const isUserExists = await User.findById(req.params.id);
    if (!isUserExists) return res.status(400).json({ error: { message: 'There\'s no such user' } });

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
};

export const unsubscribe = async (req, res) => {
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
};
