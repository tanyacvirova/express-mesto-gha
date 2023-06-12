const router = require('express').Router();
const { validateCard, validateCardId } = require('../middlewares/validate');
const cardsController = require('../controllers/cards');

router.get('/cards', cardsController.getCards);
router.post('/cards', validateCard, cardsController.createCard);
router.delete('/cards/:cardId', validateCardId, cardsController.deleteCard);
router.put('/cards/:cardId/likes', validateCardId, cardsController.likeCard);
router.delete('/cards/:cardId/likes', validateCardId, cardsController.dislikeCard);

module.exports = router;
