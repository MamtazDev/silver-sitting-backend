const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8000;

const usersRoutes = require("./routes/usersRoutes");
const makeContactRoutes = require("./routes/makeContactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// routes
app.use("/api/users", usersRoutes);
app.use("/api/makeContact", makeContactRoutes);

app.get("/", (req, res) => {
  res.send("Sever is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
