const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateUser, validatePersonalInfo, validateUserId } = require('../middlewares/validate');

router.get('/users', usersController.getUsers);
router.get('/users/me', usersController.getCurrnetUser);
router.get('/users/:userId', validateUserId, usersController.getUserById);
router.post('/users', validateUser, usersController.createUser);
router.patch('/users/me', validatePersonalInfo, usersController.updateUserInfo);
router.patch('/users/me/avatar', validatePersonalInfo, usersController.updateUserAvatar);

module.exports = router;
