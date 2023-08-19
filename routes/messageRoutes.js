const router = require("express").Router();

const {
  addMessage,
  getMessageByConversationId,
  getMessagesBySender,
} = require("../controller/message.controller");

router.post("/add", addMessage);
router.get("/:senderId/:conversationId", getMessagesBySender);
router.get("/:conversationId", getMessageByConversationId);

module.exports = router;
