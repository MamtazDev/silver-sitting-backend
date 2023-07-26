const express = require("express");
const {
  registerUser,
  emailVirification,
} = require("../controller/users.controller");

const router = express.Router();

router.post("/signup", registerUser);
router.get("/verify/:email", emailVirification);

module.exports = router;
