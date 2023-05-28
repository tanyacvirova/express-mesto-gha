const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    }).catch(() => {
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.send(users);
    }).catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
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

const createUser = (req, res) => {
  userModel.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
        err: err.message,
      });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((updatedUser) => {
      if (!avatar) {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
        return;
      }
      res.status(500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
