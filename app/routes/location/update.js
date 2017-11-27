var path = require('path');
var storage = require(path.resolve('app/storage/location'));

module.exports = (req, res, next) => {
  return Promise.resolve(storage.saveLocation(req.body.long, req.body.lat))
    .then(() => {
      res.status(200).send({'status': 'ok'});
    })
    .catch(next);
}