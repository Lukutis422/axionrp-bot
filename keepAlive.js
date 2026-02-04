const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("AxionRP bot alive");
});

module.exports = () => {
  app.listen(3000, () => {
    console.log("KeepAlive running");
  });
};
