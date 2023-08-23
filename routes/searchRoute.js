const express = require("express");
const {
  searchChildCarer,
  distanceCal,
} = require("../controller/search.controller");

const router = express.Router();

router.post("/", searchChildCarer);
router.get("/distance", distanceCal);

module.exports = router;
