var shutdownHook = require('./shutdownhook');
var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var uuid = require('uuid/v4');
var util = require('util');

var upload = multer({dest: 'uploads/'});

var dataDir = './data/';

var app = express();

var server = app.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
shutdownHook.register(server);

app.get('/ping', (req, res) => {
  res.send({"status": "up"});
});

app.post('/badge', upload.single('badge'), function (req, res, next) {
	var badgeId = uuid();
  	
	var badge = {
		id: badgeId,
      	name: req.body.name,
      	created_at: '123',
      	location: 'locationName',
      	lat: req.body.lat,
      	long: req.body.long,
      	imagePath: req.file.path
	};

	fs.writeFileSync(dataDir + badgeId + '.json', JSON.stringify(badge) , 'utf-8'); 
	res.send(badge);
})

app.get('/badge', function(req, res){
	var badges = [];
	fs.readdirSync(dataDir).forEach(file => {

		var data = fs.readFileSync(dataDir + file, 'utf8');
		badges.push(JSON.parse(data));
	});
	res.status(200).send(badges);
})


module.exports = app;