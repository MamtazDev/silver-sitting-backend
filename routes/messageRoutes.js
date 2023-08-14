const router = require("express").Router();

const {
  addMessage,
  getMessageByConversationId,
} = require("../controller/message.controller");

router.post("/add", addMessage);
router.get("/:conversationId", getMessageByConversationId);

module.exports = router;
