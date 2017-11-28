var path = require('path');
var geolib = require('geolib');
var badgeStorage = require(path.resolve('app/storage/badge'));
var locationStorage = require(path.resolve('app/storage/location'));
var receiptStorage = require(path.resolve('app/storage/receipt'));
var receiptTemplate = 'receipt1.jpg';

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
            var matchedBadge = locationStorage.getMatchedBadge();
            if (matchedBadge && matchedBadge.badgeId != 'default'){
                receiptStorage.getImageFile(receiptTemplate)
                .then(file => {
                  receiptStorage.storeReceipt(file.Body, 'public-read');
                });
            }
            locationStorage.saveMatchedBadge('default');
            return defaultBadge(res, next);
          } else {
            locationStorage.saveMatchedBadge(badge.id);
            res.status(200).send(badge);
          }          
        })
        .catch(next);
    } else {
      return defaultBadge(res, next);
    }
}

var defaultBadge = (res, next) => {
  console.log('Using default badge for current location');
    return badgeStorage.getMetadataFile(badgeStorage.defaultBadgeId())
    .then(defaultBadge => {
      res.status(200).send(defaultBadge);
    })
    .catch(next);
}