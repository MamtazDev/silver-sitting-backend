const express = require("express");
const { addFeedback } = require("../controller/feedback.controller");

const router = express.Router();

router.post("/add", addFeedback);

module.exports = router;
