const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.chat);

router.get('/conversations', aiController.getConversations);
router.post('/conversations', aiController.createConversation);
router.get('/conversations/:id/messages', aiController.getMessages);
router.post('/conversations/:id/messages', aiController.addMessage);
router.put('/conversations/:id/language', aiController.updateConversationLanguage);
router.delete('/conversations/:id', aiController.deleteConversation);

module.exports = router;
