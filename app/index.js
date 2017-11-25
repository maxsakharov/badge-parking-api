var shutdownHook = require('./shutdownhook');
var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var uuid = require('uuid/v4');
var util = require('util');
var bodyParser = require('body-parser')
var geolib = require('geolib');
var AWS = require('aws-sdk');
var base64Img = require('base64-img');

var upload = multer({dest: 'uploads/'});

// config
var dataDir = './data/';
var badgeDataDir = dataDir + 'badges/';
var locationFile = dataDir + 'location.json';
var badgeS3Bucket = 'badge-files'; //http://badge-files.s3.amazonaws.com/

// set up
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// S3 set up
AWS.config.update({region: 'us-west-2'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

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
      	location: req.body.location,
      	lat: req.body.lat,
      	long: req.body.long,
      	image: getImage(req.file.path)
	};

	saveBadge(badge, function(){
		badge.image = null;
		res.send(badge);
	});
})

app.get('/badge', function(req, res){
	var badges = [];
	forEachBadge(function(badge){
		badge.image = null;
		badges.push(badge);
	}, function(){
		res.status(200).send(badges);
	});
})

app.get('/badge/:id/image', function(req, res){
	var badgeId = req.params.id;
	findBadgeById(badgeId, function(badge){
		renderBadgeImage(res, badge);
	});
})

app.get('/badge/:id', function(req, res){
	var badgeId = req.params.id;
	findBadgeById(badgeId, function(result){
		if (result){
			result.image = null;
			res.status(200).send(result);
		}else{
			res.status(404).send();
		}
	});
})

app.put('/badge/:id', function(req, res){
	var badgeId = req.params.id;
	findBadgeById(badgeId, function(result){
		if (result){
			var updatedBadge = {
				id: badgeId,
		      	name: req.body.name === undefined ? result.name : req.body.name,
		      	created_at: result.created_at,
		      	location: req.body.location === undefined ? result.location : req.body.location,
		      	lat: req.body.lat === undefined ? result.lat : req.body.lat,
		      	long: req.body.long === undefined ? result.long : req.body.long,
		      	image: result.image
			};
			saveBadge(updatedBadge, function(){
				updatedBadge.image = null;
				res.status(200).send(updatedBadge);	
			});
		}else{
			res.status(404).send();
		}
	});
})

app.get('/dashboard', function(req, res){
	var location = readLocation();
	if (location){
		var result = null;
		forEachBadge(function(badge){
			if (badge.lat && badge.long){
				var inside = geolib.isPointInCircle(
				    {latitude: location.latitude, longitude: location.longitude},
				    {latitude: badge.lat, longitude: badge.long},
				    30
				);
				if (inside){
					result = badge;
				}
			}
		}, function(){
			renderBadgeImage(res, result);	
		});
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
		var filepath = base64Img.imgSync(badge.image, 'uploads', uuid());
		var img = fs.readFileSync(filepath);
		fs.unlinkSync(filepath);

		res.setHeader('Content-Type', 'image/png');
		res.setHeader('Content-Length', img.length);
		res.status(200).send(img);
	}else{
		res.status(404).send();
	}
}

function findBadgeById(badgeId, callback){
	var result = null;
	forEachBadge(function(badge){
		if (result == null){
			if (badge.id == badgeId && result == null){
				result = badge;
			}
		}
	}, function(){
		callback(result);
	});
}

function saveBadge(badge, callback){
	var params = {
  		Body: JSON.stringify(badge), 
  		Bucket: badgeS3Bucket, 
  		Key: badge.id, 
  		ServerSideEncryption: "AES256"
  	};
 s3.putObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else {
   		console.log(data);
   	    console.log('Saved badge with id = '+ badge.id);           // successful response
   }
   callback();
 });
}
function forEachBadge(func, callback){
	var params = {
	  Bucket: badgeS3Bucket, 
	  MaxKeys: 100
	 };
	 s3.listObjects(params, function(err, data) {
	 	var results = null;
	   if (err) console.log(err, err.stack); // an error occurred
	   else  {
		   	var actions = data.Contents.map(function(item){
				return new Promise((resolve, reject) => {
					var s3req = s3.getObject({Bucket: badgeS3Bucket, Key: item.Key});
				    s3req.on('error', reject);
				    s3req.on('success', function(data){
				    	resolve(data);
				    });
				    s3req.send();
				  });
		   	});

	   		results = Promise.all(actions);
	   	}
	   	if (results){
			results.then(data => {
				data.forEach(function(dataItem){
					if (dataItem && dataItem.data && dataItem.data.Body){
						var json = JSON.parse(dataItem.data.Body);
						func(json);		
					}
				});
			    callback(); 
			});
	   	}else{
	   		callback(); 
	   	}
	 });
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
function getImage(imagePath){
	var data = base64Img.base64Sync(imagePath);
	fs.unlinkSync(imagePath);
	return data;
}

module.exports = app;