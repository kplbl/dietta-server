const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const PASS = process.env.DB_PASS;

app.use(helmet());
app.use(cors());
app.use(express.json());

const baza = `mongodb+srv://blaz123:${PASS}@cluster0.opr9q.mongodb.net/dietta?retryWrites=true&w=majority`;

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/foods", require("./routes/foods"));
app.use("/api/diary", require("./routes/diary"));

mongoose
  .connect(baza)
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.json("Dietta API");
});

//app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
