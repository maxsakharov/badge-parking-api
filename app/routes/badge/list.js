var path = require('path');
var storage = require(path.resolve('app/storage/badge'));

module.exports = (req, res, next) => {
    return storage.listMetadataFiles()
      .map(id => {
        return storage.getMetadataFile(id);
      })
      .then(content => {
        var sorted = content.sort((o1,o2) => {
          return Date.parse(o1.created_at) < Date.parse(o2.created_at);
        });
        return sorted;
      })
      .then(content => {        
        return res.status(200).send(content);	
      })
      .catch(next);
}