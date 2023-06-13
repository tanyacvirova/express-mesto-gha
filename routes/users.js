const router = require('express').Router();
const usersController = require('../controllers/users');
const { validatePersonalInfo, validateAvatar, validateUserId } = require('../middlewares/validate');

router.get('/users', usersController.getUsers);
router.get('/users/me', usersController.getCurrnetUser);
router.get('/users/:userId', validateUserId, usersController.getUserById);
router.patch('/users/me', validatePersonalInfo, usersController.updateUserInfo);
router.patch('/users/me/avatar', validateAvatar, usersController.updateUserAvatar);

module.exports = router;
