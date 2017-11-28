var Promise = require('bluebird');
var AWS = require('aws-sdk');
var util = require('util')

const bucket = "badge-files-" + process.env.ENV;
const receiptImageFolder = "receipts";
const receiptImageFile = "receipt.jpg";
const region = "us-east-1";

AWS.config.setPromisesDependency(Promise);
AWS.config.update({region: region});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

module.exports.storeReceipt = (data, acl) => {
  return storeFile(bucket, receiptImageFolder, receiptImageFile, data, acl);
}

module.exports.removeReceipt = () => {
  return removeFile(receiptImageFolder, receiptImageFile);
}

module.exports.getImageFile = (filename) => {
  return getFile(receiptImageFolder, filename);
}

var storeFile = (bucket, folder, filename, data, acl) => {
  var params = {
    Body: data, 
    Bucket: bucket, 
    Key: folder + '/' + filename, 
    ACL: acl || 'private',
    ServerSideEncryption: "AES256",
    Metadata: {
     "Cache-Control": "no-cache"
    }
  };

  return s3.putObject(params).promise()
    .then(res => {
      return res;
    });
}

var removeFile = (folder, filename) => {  
  return s3.deleteObject({
      Bucket: bucket, 
      Key: folder + '/' + filename
    })
    .promise();
}

var getFile = (folder, filename) => {  
  return s3.getObject({
      Bucket: bucket, 
      Key: folder + '/' + filename
    })
    .promise();
}