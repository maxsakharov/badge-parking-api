var shutdownHook = require('./shutdownhook');
var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var uuid = require('uuid/v4');
var util = require('util');
var bodyParser = require('body-parser')
var geolib = require('geolib');

var upload = multer({dest: 'uploads/'});

var dataDir = './data/';
var badgeDataDir = dataDir + 'badges/';
var locationFile = dataDir + 'location.json';

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
      	created_at: new Date().toISOString(),
      	location: 'locationName',
      	lat: req.body.lat,
      	long: req.body.long,
      	imagePath: req.file.path
	};

	saveBadge(badge);
	res.send(badge);
})

app.get('/badge', function(req, res){
	var badges = [];
	fs.readdirSync(badgeDataDir).forEach(file => {
		if (file.endsWith('.json')){
			var data = fs.readFileSync(badgeDataDir + file, 'utf8');
			badges.push(JSON.parse(data));
		}
	});
	res.status(200).send(badges);
})

app.get('/badge/:id/image', function(req, res){
	var badgeId = req.params.id;
	var result = findBadgeById(badgeId);
	
	renderBadgeImage(res, result);
})

app.get('/badge/:id', function(req, res){
	var badgeId = req.params.id;
	var result = findBadgeById(badgeId);
	if (result){
		res.status(200).send(result);
	}else{
		res.status(404).send();
	}
})

app.put('/badge/:id', function(req, res){
	var badgeId = req.params.id;
	var result = findBadgeById(badgeId);
	
	if (result){
		var updatedBadge = {
			id: badgeId,
	      	name: req.body.name === undefined ? result.name : req.body.name,
	      	created_at: result.created_at,
	      	location: req.body.location === undefined ? result.location : req.body.location,
	      	lat: req.body.lat === undefined ? result.lat : req.body.lat,
	      	long: req.body.long === undefined ? result.long : req.body.long,
	      	imagePath: result.imagePath
		};
		saveBadge(updatedBadge);

		res.status(200).send(updatedBadge);
	}else{
		res.status(404).send();
	}
})

app.get('/dashboard', function(req, res){
	var location = readLocation();
	if (location){
		var result = null;
		fs.readdirSync(badgeDataDir).forEach(file => {
			if (file.endsWith('.json') && result == null){
				var data = fs.readFileSync(badgeDataDir + file, 'utf8');
				var badge = JSON.parse(data);

				var inside = geolib.isPointInCircle(
				    {latitude: location.latitude, longitude: location.longitude},
				    {latitude: badge.lat, longitude: badge.long},
				    30
				);
				console.log(inside);
				if (inside){
					result = badge;
				}
			}
		});

		renderBadgeImage(res, result);
	}else{
		res.status(404).send({'status': 'Location not defined'});
	}
})

app.post('/location', function(req, res){
	var location = {
		latitude: req.query.lat,
		longitude: req.query.long
	}
	saveLocation(location);

	res.status(200).send({'status': 'ok'});
})

function renderBadgeImage(res, badge){
	if (badge){
		var data = fs.readFileSync(badge.imagePath);
		res.setHeader('content-type', 'image/png');
		res.status(200).send(data);
	}else{
		res.status(404).send();
	}
}

function findBadgeById(badgeId){
	var result = null;
	fs.readdirSync(badgeDataDir).forEach(file => {
		if (file.endsWith('.json')){
			if (result == null){
				var data = fs.readFileSync(badgeDataDir + file, 'utf8');
				var badge = JSON.parse(data);
				if (badge.id == badgeId && result == null){
					result = badge;
				}
			}
		}
	});
	return result;
}

function saveBadge(badge){
	fs.writeFileSync(badgeDataDir + badge.id + '.json', JSON.stringify(badge) , 'utf-8'); 
}

function readLocation(){
	var location = null;
	try{
		var data = fs.readFileSync(locationFile, 'utf8');
		location = JSON.parse(data);
	} catch(err){console.log(err)}
	
	return location;
}
function saveLocation(location){
	fs.writeFileSync(locationFile, JSON.stringify(location) , 'utf-8'); 
}

module.exports = app;