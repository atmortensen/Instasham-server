const express = require('express');
const aws = require('aws-sdk');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const pg = require('pg')

if(!process.env.PORT){
  require('dotenv').config()
}

const poolConfig = {
  user: process.env.DB_USER, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASS, 
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  ssl: true,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}
const pgPool = new pg.Pool(poolConfig)

app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000))

const S3_BUCKET = process.env.S3_BUCKET
const s3 = new aws.S3()

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
      console.log(err)
      res.end()
    }
    res.json({
      signedURL: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${req.query['file-name']}`
    })
  })

})

app.post('/saveUrl', (req, res) => {
  pgPool.query('INSERT INTO imageUrls (url) VALUES ($1)', [req.body.url], (err) => {
    if(err) console.log(err)
    res.end()
  })
})

app.get('/getUrls', (req, res) => {
  pgPool.query('SELECT * FROM imageUrls', [], (err, response) => {
    if(err) console.log(err)
    res.json(response.rows)
  })
})

app.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'))
})