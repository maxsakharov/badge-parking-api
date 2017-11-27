
var fs = require('fs');

const dataDir       = './.data';
const locationFile  = dataDir + '/location.json';

module.exports.saveLocation = (long, lat) => {
  if (!long || !lat) {
    throw new Error("please provide long and lat");
  }
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
  }
  var location = JSON.stringify({lat:  lat, long: long});
  // console.log("Updating location to " + location);
  return fs.writeFileSync(locationFile, location, 'utf-8'); 
}

module.exports.getCurrentLocation = () => {
    if (!fs.existsSync(locationFile)) return null;
		var data = fs.readFileSync(locationFile, 'utf8');
		return JSON.parse(data);
}