const express = require("express");
const {
  registerUser,
  emailVirification,
  loginUser,
  getAllUsers,
  deleteUser,
  getUser,
  editUser,
  uploadDocuments,
} = require("../controller/users.controller");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.delete("/delete/:id", deleteUser);
router.get("/verify/:email", emailVirification);
router.put("/upload/:id", uploadDocuments);
router.put("/edit/:id", editUser);
router.get("/:id", getUser);

module.exports = router;
