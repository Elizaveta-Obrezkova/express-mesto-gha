const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllerrs/users');
const auth = require('./middlewares/auth');
const allErrors = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)\S*/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use((_, res, next) => {
  next(new NotFoundError('Запрос не может быть обработан. Неправильный путь.'));
});

app.use(errors());

app.use(allErrors);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
