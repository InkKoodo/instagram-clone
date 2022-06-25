import jwt from 'jsonwebtoken';

const JWT_SIGN = process.env.JWT_SECRET_KEY;

export const createToken = async (payload) => {
  const token = await jwt.sign(
    payload,
    JWT_SIGN,
    { expiresIn: '10m' },
  );

  return `Bearer ${token}`;
};
