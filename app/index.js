var shutdownHook = require('./shutdownhook');
var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
shutdownHook.register(server);

app.get('/ping', (req, res) => {
  res.send({"status": "up"});
});

module.exports = app;