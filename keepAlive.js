const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("AxionRP bot is alive");
});

function keepAlive() {
  app.listen(3000, () => {
    console.log("KeepAlive running");
  });
}

module.exports = keepAlive;