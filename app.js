const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '634c413c22147379c701141b',
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use(async (req, res) => {
  try {
    const route = req.params.path.method;
    try {
      const result = route(req);
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: 'На сервере призошла ошибка', err });
    }
  } catch (err) {
    res.status(404).send({ message: 'Запрос не может быть обработан. Неправильный путь.', err });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
