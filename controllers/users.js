const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const userModel = require('../models/user');
const ValidationError = require('../errors/validation-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnhandledError = require('../errors/unhandled-err');

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const getCurrnetUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const data = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const logInUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Error('Unauthorized');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        throw new UnauthorizedError('Неверные пользователь или пароль.');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        throw new UnauthorizedError('Неверные пользователь или пароль.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
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
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
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
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара.');
      }
      throw new UnhandledError('На сервере произошла ошибка.');
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  logInUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrnetUser,
};
