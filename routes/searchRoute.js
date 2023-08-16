const express = require("express");
const { searchChildCarer } = require("../controller/search.controller");

const router = express.Router();

router.get("/", searchChildCarer);

module.exports = router;
