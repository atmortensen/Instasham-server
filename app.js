const express = require('express');
const aws = require('aws-sdk');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

if(!process.env.PORT){
  require('dotenv').config()
}

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000))

const S3_BUCKET = process.env.S3_BUCKET
const s3 = new aws.S3()

app.get('/sign-s3', cors(), (req, res) => {
  
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: req.query['file-name'],
    Expires: 60,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err)
      res.end()
    }
    res.json({
      signedURL: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${req.query['file-name']}`
    })
  })

})

app.get('*', function(req, res) {
  res.send('S3 Uploader') 
})


app.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'))
})