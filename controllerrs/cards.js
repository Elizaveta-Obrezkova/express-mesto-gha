const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-err');
const NoAccessError = require('../errors/no-access-err');

const createCard = (req, res, next) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      console.log(card.owner);
      if (card.owner !== req.user._id) {
        throw new NoAccessError('Недостаточно прав для удаления чужой карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((deletecard) => {
          res.send(deletecard);
        });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена'))
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
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена'))
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
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
