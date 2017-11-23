'use strict';

var Http = require('http');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var Path = require('path');

var App = Express();

var Server = Http.createServer(App);

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(Swaggerize({
    //api: Path.resolve('./swagger.json'),
    api: require('./swagger.json'),
    docspath: '/api-docs',
    //handlers: Path.resolve('./handlers')
    handlers: './handlers'
}));

Server.listen(8080, function () {
	console.log(Server.address().address + ':' + Server.address().port);
    App.swagger.api.host = this.address().address + ':' + this.address().port;
    /* eslint-disable no-console */
    console.log('App running on %s:%d', this.address().address, this.address().port);
    /* eslint-disable no-console */
});
