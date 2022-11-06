const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

const JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b';

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail(new AuthError('Неправильное email или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Неправильное email или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            });
          res.status(200).send({ massage: 'Авторизация прошла успешно' });
        })
        .catch(next);
    })
    .catch(next);
}

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((newUser) => {
      res.send(newUser);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((newUser) => {
      res.send(newUser);
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUser,
  getUserById,
  getUserInfo,
  updateUser,
  updateAvatar,
};
