const mongoose = require('mongoose');
const Card = require('../models/cards');

const createCard = (req, res) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('Not Found'))
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          res.send(card);
        });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Не корректный _id', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const likeCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('Not Found'))
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .then((newCard) => {
          res.send(newCard);
        });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Не корректный _id', err });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const dislikeCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('Not Found'))
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        .then((newCard) => {
          res.send(newCard);
        });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
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
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
