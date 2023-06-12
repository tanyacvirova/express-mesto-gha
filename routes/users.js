const router = require('express').Router();
const usersController = require('../controllers/users');
const validation = require('../middlewares/validate').validateUser;

router.get('/users', usersController.getUsers);
router.get('/users/me', usersController.getCurrnetUser);
router.get('/users/:userId', usersController.getUserById);
router.post('/users', validation, usersController.createUser);
router.patch('/users/me', usersController.updateUserInfo);
router.patch('/users/me/avatar', usersController.updateUserAvatar);

module.exports = router;
