const express = require("express");
const {
  searchController
} = require("../controller/search.controller");



const router = express.Router();

router.get("/", searchController);

module.exports = router;
