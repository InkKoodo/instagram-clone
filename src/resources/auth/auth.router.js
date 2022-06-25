import express from 'express';
import bcrypt from 'bcrypt';

import User from '../user/user.model';
import { createToken } from './jwt.actions';

const router = express.Router();

// create User
router.post('/sign-up', async (req, res) => {
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
});

router.post('/sign-in', async (req, res) => {
  // validate received data todo: check Validation later
  const { username, password } = req.body;

  try {
    // check user's existence
    const user = await User.findOne({ 'bio.username': username });
    if (!user) {
      return res.status(400).json(
        { error: { message: 'Something went wrong, please try again' } },
      );
    }

    const { password: hashPassword, _id } = user;
    // validate received password
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    // if incorrect - return
    if (!isPasswordValid) {
      return res.status(400).json(
        { error: { message: 'Something went wrong, please try again' } },
      );
    }
    // send to user new token
    const token = await createToken({ userId: _id });
    await res.set('x-auth-token', token);
    // redirect to home
    return res.status(200).end();
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
