const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    }).catch(() => {
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const createCard = (req, res) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((deletedCard) => {
      res.send(deletedCard);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const likeCard = (req, res) => {
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
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const dislikeCard = (req, res) => {
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
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
