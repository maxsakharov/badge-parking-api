var path = require('path');
var storage = require(path.resolve('app/storage/badge'));

module.exports = (req, res, next) => {
    return storage.getMetadataFile(req.params.id)
      .then(metadata => {
        if (!metadata) return res.status(404);
        return res.status(200).send(metadata);
      })
      .catch(next);
}