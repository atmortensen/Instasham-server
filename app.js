const express = require('express');
const aws = require('aws-sdk');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config();

app.use(bodyParser.json())
app.use(cors())
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3();

app.get('/account', (req, res) => res.render('account.html'));

app.post('/s3upload', (req, res) => {
  if(!req.body.data) res.end()
  buf = new Buffer(req.body.data.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  var data = {
    Bucket: S3_BUCKET,
    Key: req.body.fileName, 
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };
  s3.putObject(data, function(err){
      err ? console.log(err) : null 
      res.end()
  });
})

app.get('/sign-s3', (req, res) => {
  
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
      console.log(err);
      res.end();
    }
    res.json({
      signedURL: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${req.query['file-name']}`
    });
  });

});

app.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});
