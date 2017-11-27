var path = require('path');
var geolib = require('geolib');
var badgeStorage = require(path.resolve('app/storage/badge'));
var locationStorage = require(path.resolve('app/storage/location'));

const radius = 30;

module.exports = (req, res, next) => {
    var currentLocation = locationStorage.getCurrentLocation();
    if (currentLocation){
      return badgeStorage.listMetadataFiles()
        .map(id => {
          return badgeStorage.getMetadataFile(id);
        })
        .filter(badge => {
          var inside = false;
          if (badge.lat && badge.long){
            var inside = geolib.isPointInCircle(
                { latitude: currentLocation.lat, longitude: currentLocation.long},
                { latitude: badge.lat, longitude: badge.long },
                radius
            );            
          }
          return inside;
        })
        .then(filtered => {
            if (filtered.length > 1) {
              console.warn('Multiple badges found for current location ' + JSON.stringify(currentLocation));
            }
            return filtered[0];
        })
        .then(badge => {
          if (!badge) {
            console.log('Using default badge for current location ' + JSON.stringify(currentLocation));
            return badgeStorage.getMetadataFile(badgeStorage.defaultBadgeId())
              .then(defaultBadge => {
                res.status(200).send(defaultBadge);
              });
          } else {
            res.status(200).send(badge);
          }          
        })
        .catch(next);
    } else {
      res.status(404).send({'status': 'Initial location not defined'});
    }
}