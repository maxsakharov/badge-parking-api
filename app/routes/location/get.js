var path = require('path');
var storage = require(path.resolve('app/storage/location'));

module.exports = (req, res, next) => {
  return Promise.resolve(storage.getCurrentLocation())
    .then(location => {
      res.status(200).send(location);
    })
    .catch(next);
}