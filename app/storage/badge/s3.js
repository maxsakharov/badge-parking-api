var Promise = require('bluebird');
var AWS = require('aws-sdk');
var util = require('util')

const bucket = "badge-files";
const badgeMetadataFolder = "badge-metadata";
const badgeImageFodler = "badge-image";
const region = "us-west-2";

AWS.config.setPromisesDependency(Promise);
AWS.config.update({region: region});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

module.exports.storeMetadataFile = (filename, data, acl) => {
  return storeFile(bucket, badgeMetadataFolder, filename, data, acl);
}

module.exports.storeImageFile = (filename, data, acl) => {
  return storeFile(bucket, badgeImageFodler, filename, data, acl);
}

module.exports.defaultBadgeId = () => {
  return "default";
}

module.exports.getMetadataFile = (filename) => {
  return getFile(badgeMetadataFolder, filename)
    .then(data => {
      return JSON.parse(data.Body.toString());
    });
}

module.exports.getImageFile = (filename) => {
  return getFile(badgeImageFodler, filename);
}

module.exports.listMetadataFiles = () => {
  var params = {
    Bucket: bucket, 
    Prefix: badgeMetadataFolder,
	  MaxKeys: 10
   };
   return s3.listObjects(params)
    .promise()
    .then(list => {     
      return list.Contents;   
    })
    .map(metadata => {
      return metadata.Key.replace(badgeMetadataFolder + "/", "");
    })
}

module.exports.publicImageLocation = (id) => {
  return util.format("https://s3-%s.amazonaws.com/%s/%s/%s", region, bucket, badgeImageFodler, id)
}

var storeFile = (bucket, folder, filename, data, acl) => {
  var params = {
    Body: data, 
    Bucket: bucket, 
    Key: folder + '/' + filename, 
    ACL: acl || 'private',
    ServerSideEncryption: "AES256"
  };

  return s3.putObject(params).promise()
    .then(res => {
      return res;
    });
}

var getFile = (folder, filename) => {  
  return s3.getObject({
      Bucket: bucket, 
      Key: folder + '/' + filename
    })
    .promise();
}