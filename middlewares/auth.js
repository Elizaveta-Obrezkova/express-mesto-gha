const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
