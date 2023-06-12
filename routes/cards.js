const router = require('express').Router();
const { validateCard } = require('../middlewares/validate');
const cardsController = require('../controllers/cards');

router.get('/cards', cardsController.getCards);
router.post('/cards', validateCard, cardsController.createCard);
router.delete('/cards/:cardId', cardsController.deleteCard);
router.put('/cards/:cardId/likes', cardsController.likeCard);
router.delete('/cards/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
