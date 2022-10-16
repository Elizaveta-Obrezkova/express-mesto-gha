const mongoose = require('mongoose');
const User = require('../models/users');

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('Not Found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Не корректный _id', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const updateUser = (req, res) => {
  User.findById(req.user._id).orFail(new Error('Not Found'))
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { name: req.body.name, about: req.body.about },
        { new: true, runValidators: true },
      )
        .then((newUser) => {
          res.send(newUser);
        });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Не корректный _id', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const updateAvatar = (req, res) => {
  User.findById(req.user._id).orFail(new Error('Not Found'))
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { avatar: req.body.avatar },
        { new: true, runValidators: true },
      )
        .then((newUser) => {
          res.send(newUser);
        });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Не корректный _id', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
};
