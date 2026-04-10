import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (userId) =>
  jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

export default generateToken;
