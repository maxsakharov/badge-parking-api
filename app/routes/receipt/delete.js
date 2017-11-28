var path = require('path');
var storage = require(path.resolve('app/storage/receipt'));

module.exports = (req, res, next) => {
  return Promise.resolve(storage.removeReceipt())
    .then(() => {
      res.status(200).send({'status': 'ok'});
    })
    .catch(next);
}