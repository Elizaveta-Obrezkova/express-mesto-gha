const router = require('express').Router();
const {
  createCard,
  getCards,
  getCardById,
  likeCard,
  dislikeCard,
} = require('../controllerrs/cards');

router.post('/', createCard);

router.get('/', getCards);

router.get('/:cardId', getCardById);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
