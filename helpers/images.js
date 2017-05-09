exports = module.exports = {}
const aws = require('aws-sdk')
const s3 = new aws.S3()
if(!process.env.PORT){
  require('dotenv').config()
}

exports.signS3 = function(req, res){
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.query['file-name'],
    Expires: 60,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err)
      res.end()
    }
    res.json({
      signedURL: data,
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${req.query['file-name']}`
    })
  })
}
