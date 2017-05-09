const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')
const bodyParser = require('body-parser')
const auth = require('./helpers/fb-auth')
const images = require('./helpers/images')
const db = require('./helpers/db-connect')
const profiles = require('./helpers/profiles')
const chat = require('./helpers/chat')
const users = require('./helpers/users')

chat.join(io)
app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000))

app.get('/images/signS3', auth, images.signS3)
app.post('/profiles/login', profiles.login)
app.get('/users/findAll', auth, users.findAll)
app.get('/chat/messages/:user1/:user2', auth, chat.getMessages)
app.post('/chat/message', auth, chat.newMessage(io))

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