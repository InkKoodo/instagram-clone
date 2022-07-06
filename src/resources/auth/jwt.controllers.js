import jwt from 'jsonwebtoken';

const JWT_SIGN = process.env.JWT_SECRET_KEY;

export const createToken = async (payload) => {
  const token = await jwt.sign(
    payload,
    JWT_SIGN,
    { expiresIn: '100d' }, // todo: change to normal values after development
  );

  return `Bearer ${token}`;
};

export const verifyToken = async (req, res, next) => {
  try {
    // take token
    const bearer = req.get('x-auth-token');
    if (!bearer) return res.status(400).json({ error: { message: 'Please login' } });

    const [, token] = bearer.split(' ');
    // verify & pass token data
    req.jwtData = await jwt.verify(token, JWT_SIGN);
    return next();
  } catch (e) {
    return next(e);
  }
};
