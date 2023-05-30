const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('64723aed26fe805dd95ee640'),
  };
  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.use((req, res) => {
  res.status(404).send({
    message: 'Неверно указан путь.',
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
