var fs   = require('fs');
var path = require('path');
var uuid = require('uuid/v4');

var storage = require(path.resolve('app/storage/badge'));

module.exports = (req, res, next) => {
  var badgeId = req.params.id;
  return storage.getMetadataFile(badgeId)
    .then(metadata => {
      return {
        id: badgeId,
        created_at: metadata.created_at,
        location: metadata.location,
        name: req.body.name || metadata.name,      
        lat: req.body.lat || metadata.lat,
        long: req.body.long || metadata.long,
      };    
    })
    .then(updatedBadge => {
        return storage.storeMetadataFile(badgeId, JSON.stringify(updatedBadge))
          .then(() => {
              res.status(200).send(updatedBadge);
          });
    })
    .catch(next);
};
