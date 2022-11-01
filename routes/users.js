const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUser,
  getUserById,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllerrs/users');

router.get('/', getUser);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)\S*/),
  }),
}), updateAvatar);

module.exports = router;
