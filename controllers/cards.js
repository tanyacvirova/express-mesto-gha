const cardModel = require('../models/card');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const UnhandledError = require('../errors/unhandled-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  cardModel.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((deletedCard) => {
      if (deletedCard.owner.valueOf() !== req.user._id) {
        throw new Error('Forbidden');
      }
      cardModel.findByIdAndRemove(deletedCard._id.valueOf())
        .then(res.status(200).send({ message: 'Карточка удалена.' }))
        .catch(() => {
          throw new UnhandledError('На сервере произошла ошибка.');
        });
    })
    .catch((err) => {
      if (err.message === 'Forbidden') {
        throw new ForbiddenError('Карточку может удалить только ее автор.');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((likedCard) => {
      res.send(likedCard);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((likedCard) => {
      res.send(likedCard);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
