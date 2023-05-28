const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/users', usersController.getUsers);
router.get('/users/:userId', usersController.getUserById);
router.post('/users', usersController.createUser);
router.patch('/users/me', usersController.updateUserInfo);
router.patch('/users/me/avatar', usersController.updateUserAvatar);

module.exports = router;
