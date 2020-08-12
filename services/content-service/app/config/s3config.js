const multer = require('multer');
const multers3 = require('multer-s3');
const aws = require('aws-sdk');
let current_datetime = new Date();
const moment = require('moment');
aws.config.update({
     accessKeyId: process.env.S3AccessKeyId,
     secretAccessKey: process.env.S3AecretAccessKey,
     region: 'ap-south-1'
});
const s3 = new aws.S3;

const upload = multer({
     storage: multers3({
          s3: s3,
          bucket: process.env.S3BucketName,
          acl: 'public-read',
          metadata: function (req, file, cb) {
               cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
               cb(null, 'content/' + moment().format("YYYY-MM-DDTHH:mm:ss:SSS") + '.' + file.originalname.split('.')[1]);
          }
     })
});
module.exports = upload;
