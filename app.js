const app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const cors = require('cors')
const bodyParser = require('body-parser')
const auth = require('./helpers/fb-auth')
const signS3 = require('./helpers/s3-upload')
const db = require('./helpers/db-connect')
const profiles = require('./helpers/profiles')
const chat = require('./helpers/chat')

app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000))

app.get('/sign-s3', auth, signS3)
app.post('/login', profiles.login)
io.on('connection', chat)

app.post('/saveUrl', auth, (req, res) => {
  db.query('INSERT INTO imageUrls (url) VALUES ($1)', [req.body.url], (err) => {
    if(err) console.log(err)
    res.end()
  })
})

app.get('/getUrls', auth, (req, res) => {
  db.query('SELECT * FROM imageUrls', [], (err, response) => {
    if(err) console.log(err)
    res.json(response.rows)
  })
})

app.delete('/removeUrl', auth, (req, res) => {
  const urlSplit = req.query.url.split('/')
  const fileName = urlSplit[urlSplit.length-1]
  s3.deleteObject({
    Bucket: S3_BUCKET,
    Key: fileName
  }, function(err) {
    if(err)console.log(err)
    else {
      db.query('DELETE FROM imageUrls WHERE url = $1', [req.query.url], (err) => {
        if(err) console.log(err)
        res.end()
      })
    }
  })
})

server.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'))
})