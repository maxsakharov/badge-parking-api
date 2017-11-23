var shutdownHook = require('./shutdownhook');
var express = require('express');
var swaggerize = require('swaggerize-express');

var app = express();

app.use(swaggerize({
    api: require('../swagger.yml'),
    docspath: '/api-docs',
    handlers: '../handlers'
}));

var server = app.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
shutdownHook.register(server);

app.get('/ping', (req, res) => {
  res.send({"status": "up"});
});

module.exports = app;