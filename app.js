const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const usersController = require('./controllers/users');
const auth = require('./middlewares/auth');
const validation = require('./middlewares/validate').validateUser;
const { PORT, DB_ADDRESS } = require('./config');

mongoose.connect(DB_ADDRESS);
const app = express();

app.use(express.json());
app.use(helmet());

app.post('/signin', validation, usersController.logInUser);
app.post('/signup', validation, usersController.createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use(errors());

app.use((req, res, next) => {
  res.status(404).send({
    message: 'Неверно указан путь.',
  });
  next();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка.'
        : message,
    });
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
