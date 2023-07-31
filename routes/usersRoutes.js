const express = require("express");
const {
  registerUser,
  emailVirification,
  loginUser,
  getAllUsers,
  deleteUser,
  getUser,
} = require("../controller/users.controller");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.delete("/delete/:id", deleteUser);
router.get("/verify/:email", emailVirification);
router.get("/:id", getUser);

module.exports = router;
