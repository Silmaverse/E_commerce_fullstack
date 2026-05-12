require("dotenv").config();
const express = require("express");
const app = express();
const port = 8000;
const router = require("./routes/index");
const main = require("../server/configs/dbConfig");
main();
app.use(express.json());

app.listen(8000, () => {
  console.log(`Listening to port ${port}`);
});

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello world");
});
