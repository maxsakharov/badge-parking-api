
var fs = require('fs');

const dataDir       = './.data';
const locationFile  = dataDir + '/location.json';
const matchedFile  = dataDir + '/matched.json';

module.exports.saveLocation = (long, lat) => {
  if (!long || !lat) {
    throw new Error("please provide long and lat");
  }
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
  }
  var location = JSON.stringify({lat:  lat, long: long});
  return fs.writeFileSync(locationFile, location, 'utf-8'); 
}

module.exports.getCurrentLocation = () => {
    if (!fs.existsSync(locationFile)) return null;
		var data = fs.readFileSync(locationFile, 'utf8');
		return JSON.parse(data);
}

module.exports.saveMatchedBadge = (badgeId) => {
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
  }
  var data = JSON.stringify({badgeId: badgeId});
  return fs.writeFileSync(matchedFile, data, 'utf-8'); 
}

module.exports.getMatchedBadge = () => {
    if (!fs.existsSync(matchedFile)) return null;
		var data = fs.readFileSync(matchedFile, 'utf8');
		return JSON.parse(data);
}
