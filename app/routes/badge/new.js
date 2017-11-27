var fs   = require('fs');
var path = require('path');
var uuid = require('uuid/v4');

var storage = require(path.resolve('app/storage/badge'));

module.exports = (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({"error": "no file defined"});
  }
  
  var badgeId = req.body.is_default ? storage.defaultBadgeId() : uuid();  
  var metadata = {
    id: badgeId,
    name: req.body.name,
    lat: req.body.lat,
    long: req.body.long,
    created_at: new Date().toISOString(),
    location: storage.publicImageLocation(badgeId),
  }
  
  var storeImage = storage.storeImageFile(badgeId, fs.createReadStream(req.file.path), 'public-read');
  var storeMetadata = storage.storeMetadataFile(badgeId, JSON.stringify(metadata));

  return Promise.all([storeImage, storeMetadata])
    .then(() => {
      return fs.unlinkSync(req.file.path);
    })
    .then(() => {
      return res.status(201).send(metadata);
    })
    .catch(next);
};
