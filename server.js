const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Sever is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
