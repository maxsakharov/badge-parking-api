var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});

app.get('/ping', (req, res) => {
  res.send({"status": "alive"});
});

module.exports = app;