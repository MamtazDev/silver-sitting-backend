const express = require("express");
const { searchChildCarer } = require("../controller/search.controller");

const router = express.Router();

router.post("/", searchChildCarer);

module.exports = router;
